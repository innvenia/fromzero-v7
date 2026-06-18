import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const toolDir = path.dirname(__filename);
const adapterRoot = path.resolve(toolDir, "..");

const RULES_BEGIN = "<!-- FROMZERO_RULES:BEGIN -->";
const RULES_END = "<!-- FROMZERO_RULES:END -->";
const AGENT_LOCK_FILE = ".fromzero-install.json";
const WORKFLOW_MARKER = "<!-- FROMZERO_AGENT_WORKFLOW:BEGIN managed=true -->";
const ARTIFACTS_DIR = "artifacts";
const START_HERE_PATH = path.posix.join(ARTIFACTS_DIR, "START_HERE.md");
const COMMON_METADATA_FIELDS = [
  "Artefacto",
  "Propósito o subtítulo",
  "Proyecto",
  "Versión del adaptador FromZero",
  "Fecha de creación",
  "Última actualización",
  "Estado actual",
  "Historial de estados",
  "Aprobación del usuario",
  "Fecha de aprobación",
  "Frase literal de aprobación",
  "Artefactos prerequisito",
  "Documentos o fuentes asociadas",
  "Artefactos derivados o relacionados",
  "Commit asociado",
  "Restricciones de seguridad"
];

const ARTIFACT_REQUIRED_ANCHORS = {
  FROMZERO_CONTEXT: ["## Metadatos", "## Fuentes del insumo", "## Inventario atomico de requisitos"],
  FROMZERO_QUESTIONNAIRE: ["## Metadatos", "## Estado general", "## Revisión y aprobación"],
  FROMZERO_SPEC: ["## Metadatos", "## Fuentes", "## Matriz de cobertura del insumo", "## Aprobación"],
  FROMZERO_PLAN: ["## Metadatos", "## 5.5 Conteo de cobertura REQ/GATE", "## 10. Siguiente aprobación"],
  FROMZERO_STATE: ["## Metadatos", "## 1. Estado general", "## 6.1 Historial de aprobaciones"]
};

function parseArgs(argv) {
  const args = {
    project: process.cwd(),
    app: null,
    docs: "docs",
    force: false,
    dryRun: false,
    skipRules: false,
    skipAgentDir: false,
    forceAgentDir: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--project") {
      args.project = argv[++index];
    } else if (arg === "--app") {
      args.app = argv[++index];
    } else if (arg === "--docs") {
      args.docs = argv[++index];
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--skip-rules") {
      args.skipRules = true;
    } else if (arg === "--skip-agent-dir") {
      args.skipAgentDir = true;
    } else if (arg === "--force-agent-dir") {
      args.forceAgentDir = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function readVersion() {
  const antigravityManifest = path.join(adapterRoot, "plugin.json");
  if (fs.existsSync(antigravityManifest)) {
    return JSON.parse(fs.readFileSync(antigravityManifest, "utf8")).version ?? "unknown";
  }

  const codexManifest = path.join(adapterRoot, ".codex-plugin", "plugin.json");
  if (fs.existsSync(codexManifest)) {
    return JSON.parse(fs.readFileSync(codexManifest, "utf8")).version ?? "unknown";
  }

  const claudeManifest = path.join(adapterRoot, ".claude-plugin", "plugin.json");
  if (fs.existsSync(claudeManifest)) {
    return JSON.parse(fs.readFileSync(claudeManifest, "utf8")).version ?? "unknown";
  }

  const versionFile = path.join(adapterRoot, "VERSION");
  if (fs.existsSync(versionFile)) {
    return fs.readFileSync(versionFile, "utf8").trim() || "unknown";
  }

  return "unknown";
}

function detectApp(explicitApp) {
  if (explicitApp) {
    return explicitApp;
  }

  if (fs.existsSync(path.join(adapterRoot, ".codex-plugin", "plugin.json"))) {
    return "Codex";
  }

  if (
    fs.existsSync(path.join(adapterRoot, ".claude-plugin", "plugin.json")) ||
    fs.existsSync(path.join(adapterRoot, "CLAUDE.md"))
  ) {
    return "Claude Code";
  }

  if (fs.existsSync(path.join(adapterRoot, "GEMINI.md"))) {
    return "Antigravity";
  }

  return "Agente";
}

function defaultPluginPath(projectRoot, appName) {
  const app = appName.toLowerCase();
  if (app === "codex") {
    return path.join(projectRoot, ".codex", "plugins", "fromzero");
  }
  if (app === "claude code") {
    return "paquete local `fromzero` (carga con `claude --plugin-dir <ruta>` o lectura directa)";
  }
  if (app === "antigravity") {
    return "paquete local `fromzero` + materializacion en `.agent/` del proyecto";
  }
  return "paquete local `fromzero`";
}

function rulesFileFor(appName) {
  const app = appName.toLowerCase();
  if (app === "codex") {
    return "AGENTS.md";
  }
  if (app === "claude code") {
    return "CLAUDE.md";
  }
  if (app === "antigravity") {
    return "GEMINI.md";
  }
  return null;
}

function renderTemplate(template, replacements) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => replacements[key] ?? "");
}

function rulesBlock(appName, version, pluginPath) {
  return [
    RULES_BEGIN,
    "## FromZero",
    "",
    `- Este proyecto usa la metodología FromZero (paquete \`fromzero\`, versión ${version}, app ${appName}).`,
    `- Ubicación del paquete: ${pluginPath}.`,
    "- Ante frases como \"revisa este proyecto\", \"continúa con la ejecución del proyecto\" o \"ejecuta el siguiente Sprint\", aplica las skills FromZero empezando por `fz-context`; el estado central vive en `artifacts/FROMZERO_STATE.md`.",
    "- `Continua con la ejecucion del proyecto` solo reanuda un plan aprobado. Para aprobar un plan en revisión, usa `Apruebo el plan`.",
    `- Guía del usuario: \`${START_HERE_PATH}\`. Guía del adaptador: \`FIRST_STEPS.md\` dentro del paquete.`,
    `- Cierre obligatorio de instalación o actualización: copia el bloque final obligatorio mostrado por \`tools/init-project.mjs\`; no lo resumas, no lo sustituyas por una lista propia y conserva el enlace Markdown a \`${START_HERE_PATH}\`.`,
    "- Si el proyecto no tiene Git inicializado, recomienda inicializarlo antes de ejecutar FromZero para conservar un punto de partida, revisar cambios y revertir con seguridad.",
    "- No uses pasos, fases, Sprints, etapas ni items visibles numerados como `0`; todo empieza en `1`.",
    "- No leas `.env` reales; documenta variables en `.env.example`.",
    RULES_END
  ].join("\n");
}

function markdownFileLink(label, filePath) {
  const normalizedTarget = filePath.replaceAll("\\", "/");
  const target = /\s/.test(normalizedTarget) ? `<${normalizedTarget}>` : normalizedTarget;
  return `[${label}](${target})`;
}

function findGitRoot(projectRoot) {
  let current = path.resolve(projectRoot);

  while (true) {
    if (fs.existsSync(path.join(current, ".git"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function gitStatus(projectRoot) {
  const gitRoot = findGitRoot(projectRoot);
  if (!gitRoot) {
    return {
      templateStatus: "no detectado; recomendado inicializar antes de empezar",
      message: [
        "Control de versiones: no detecté Git inicializado en este proyecto.",
        "Te recomiendo inicializarlo antes de usar FromZero: así guardas un punto de partida limpio, puedes revisar los cambios del agente y puedes volver atrás si algo no queda bien.",
        "Prompt sugerido: `Inicializa Git en este proyecto y crea el primer commit del estado actual antes de ejecutar FromZero.`"
      ]
    };
  }

  if (path.resolve(gitRoot) === path.resolve(projectRoot)) {
    return {
      templateStatus: "Git detectado en la raíz del proyecto",
      message: [
        "Control de versiones: Git ya está inicializado en este proyecto.",
        "Recomendación: trabaja con commits pequeños por Sprint para revisar y revertir cambios con claridad."
      ]
    };
  }

  return {
    templateStatus: `Git detectado en un directorio padre: ${gitRoot}`,
    message: [
      `Control de versiones: Git está inicializado en un directorio padre: ${markdownFileLink("repositorio Git", gitRoot)}.`,
      "Confirma si ese repositorio debe controlar este proyecto antes de iniciar FromZero."
    ]
  };
}

function completionMessage(appName, outputPath, version, projectRoot) {
  const startHereLink = markdownFileLink(START_HERE_PATH, outputPath);
  const versionControl = gitStatus(projectRoot);

  return [
    "",
    "Mensaje final obligatorio para el usuario. Copia este bloque sin resumirlo y conserva el enlace Markdown:",
    "",
    `Se instaló correctamente el plugin FromZero versión ${version} para ${appName}.`,
    `Las instrucciones para inicializar y ejecutar FromZero están en ${startHereLink}.`,
    ...versionControl.message,
    `Revisa ${START_HERE_PATH} antes de iniciar la metodología para comprender el flujo, aprobar artefactos o pedir correcciones.`
  ].join("\n");
}

function writeRulesFile(projectRoot, appName, version, pluginPath, summary, options = {}) {
  const fileName = rulesFileFor(appName);
  if (!fileName) {
    summary.push("rules: app desconocida, no se creó archivo de reglas");
    return;
  }

  const target = path.join(projectRoot, fileName);
  const block = rulesBlock(appName, version, pluginPath);

  if (!fs.existsSync(target)) {
    if (options.dryRun) {
      summary.push(`rules: dry-run crearía ${fileName} con bloque FromZero`);
      return;
    }
    fs.writeFileSync(target, `${block}\n`, "utf8");
    summary.push(`rules: creado ${fileName} con bloque FromZero`);
    return;
  }

  const existing = fs.readFileSync(target, "utf8");
  if (existing.includes(RULES_BEGIN) && existing.includes(RULES_END)) {
    const pattern = new RegExp(`${RULES_BEGIN}[\\s\\S]*?${RULES_END}`);
    if (options.dryRun) {
      summary.push(`rules: dry-run actualizaría bloque FromZero en ${fileName}`);
      return;
    }
    fs.writeFileSync(target, existing.replace(pattern, block), "utf8");
    summary.push(`rules: bloque FromZero actualizado en ${fileName}`);
    return;
  }

  if (options.dryRun) {
    summary.push(`rules: dry-run anexaría bloque FromZero a ${fileName} existente`);
    return;
  }
  fs.writeFileSync(target, `${existing.trimEnd()}\n\n${block}\n`, "utf8");
  summary.push(`rules: bloque FromZero anexado a ${fileName} existente (contenido previo conservado)`);
}

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function materializeAgentDir(projectRoot, summary, options) {
  const agentRoot = path.join(projectRoot, ".agent");
  const targets = [];
  const skillNames = collectAgentSkillTargets(targets);

  if (skillNames.length === 0) {
    const message = "agent-dir: Antigravity skills package unavailable in this tool root; run adapters/antigravity/tools/init-project.mjs to materialize .agent skills and workflows.";
    if (options.dryRun) {
      summary.push(message);
      return;
    }
    throw new Error(message);
  }

  const ruleCount = collectAgentRuleTargets(targets);

  if (targets.length === 0) {
    summary.push("agent-dir: no hay archivos FromZero para materializar");
    return;
  }

  const lock = readAgentLock(agentRoot, options.forceAgentDir);
  const lockMap = new Map((lock?.files ?? []).map((file) => [file.path, file.sha256]));
  const conflicts = findAgentConflicts(projectRoot, targets, lockMap, options.forceAgentDir);

  if (conflicts.length > 0) {
    for (const conflict of conflicts) {
      summary.push(`agent-dir: conflicto ${conflict}`);
    }
    throw new Error(".agent contiene archivos no administrados o modificados. Revisa los conflictos o reintenta con --force-agent-dir.");
  }

  if (options.dryRun) {
    summary.push(`agent-dir: dry-run materializaría ${skillNames.length} skills en .agent/skills/`);
    summary.push(`agent-dir: dry-run materializaría ${skillNames.length} workflows en .agent/workflows/`);
    summary.push(`agent-dir: dry-run materializaría ${ruleCount} reglas en .agent/rules/`);
    summary.push(`agent-dir: dry-run actualizaría .agent/${AGENT_LOCK_FILE}`);
    return;
  }

  const records = [];
  for (const target of targets) {
    const absolutePath = path.join(projectRoot, target.path);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, target.content);
    records.push({
      path: target.path,
      sha256: hashContent(target.content),
      source: target.source,
      kind: target.kind
    });
  }

  fs.mkdirSync(agentRoot, { recursive: true });
  fs.writeFileSync(path.join(agentRoot, AGENT_LOCK_FILE), `${JSON.stringify({
    version: options.version,
    app: options.appName,
    generatedAt: new Date().toISOString(),
    files: records.sort((a, b) => a.path.localeCompare(b.path))
  }, null, 2)}\n`, "utf8");

  summary.push(`agent-dir: ${skillNames.length} skills copiadas a .agent/skills/`);
  summary.push(`agent-dir: ${skillNames.length} workflows creados en .agent/workflows/`);
  summary.push(`agent-dir: ${ruleCount} reglas copiadas a .agent/rules/ (prefijo fromzero-)`);
  summary.push(`agent-dir: lock actualizado en .agent/${AGENT_LOCK_FILE}`);
}

function collectAgentSkillTargets(targets) {
  const skillsSource = path.join(adapterRoot, "skills");
  if (!fs.existsSync(skillsSource)) {
    return [];
  }

  const skillNames = fs
    .readdirSync(skillsSource, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const skill of skillNames) {
    const skillRoot = path.join(skillsSource, skill);
    for (const filePath of listFiles(skillRoot)) {
      const relativeFile = normalizeRelativePath(path.relative(skillRoot, filePath));
      targets.push({
        path: normalizeRelativePath(path.join(".agent", "skills", skill, relativeFile)),
        content: fs.readFileSync(filePath),
        source: normalizeRelativePath(path.relative(adapterRoot, filePath)),
        kind: "skill"
      });
    }

    const workflow = [
      WORKFLOW_MARKER,
      `# ${skill}`,
      "",
      `Ejecuta la fase ${skill} de FromZero siguiendo \`.agent/skills/${skill}/SKILL.md\`.`,
      "Lee `artifacts/FROMZERO_STATE.md` antes de actuar y entrega el informe de cierre de fase al terminar.",
      ""
    ].join("\n");
    targets.push({
      path: normalizeRelativePath(path.join(".agent", "workflows", `${skill}.md`)),
      content: workflow,
      source: `generated:workflow:${skill}`,
      kind: "workflow"
    });
  }

  return skillNames;
}

function collectAgentRuleTargets(targets) {
  const rulesSource = path.join(adapterRoot, "rules");
  if (!fs.existsSync(rulesSource)) {
    return 0;
  }

  let count = 0;
  for (const entry of fs.readdirSync(rulesSource, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const filePath = path.join(rulesSource, entry.name);
      targets.push({
        path: normalizeRelativePath(path.join(".agent", "rules", `fromzero-${entry.name}`)),
        content: fs.readFileSync(filePath),
        source: normalizeRelativePath(path.relative(adapterRoot, filePath)),
        kind: "rule"
      });
      count += 1;
    }
  }
  return count;
}

function readAgentLock(agentRoot, forceAgentDir) {
  const lockPath = path.join(agentRoot, AGENT_LOCK_FILE);
  if (!fs.existsSync(lockPath)) {
    return null;
  }

  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    if (!Array.isArray(lock.files)) {
      throw new Error("files must be an array");
    }
    return lock;
  } catch (error) {
    if (forceAgentDir) {
      return null;
    }
    throw new Error(`Invalid .agent/${AGENT_LOCK_FILE}: ${error.message}`);
  }
}

function findAgentConflicts(projectRoot, targets, lockMap, forceAgentDir) {
  if (forceAgentDir) {
    return [];
  }

  const conflicts = [];
  for (const target of targets) {
    const absolutePath = path.join(projectRoot, target.path);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const managedHash = lockMap.get(target.path);
    const existingHash = hashContent(fs.readFileSync(absolutePath));
    if (!managedHash) {
      conflicts.push(`${target.path} existe sin lock FromZero`);
    } else if (managedHash !== existingHash) {
      conflicts.push(`${target.path} fue modificado después de la última instalación FromZero`);
    }
  }
  return conflicts;
}

function listFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function normalizeRelativePath(value) {
  return value.replaceAll("\\", "/");
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function fromZeroArtifactFiles(projectRoot) {
  const artifactsRoot = path.join(projectRoot, ARTIFACTS_DIR);
  if (!fs.existsSync(artifactsRoot)) {
    return [];
  }
  return fs
    .readdirSync(artifactsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^FROMZERO_[A-Z_]+\.md$/.test(entry.name))
    .map((entry) => path.join(artifactsRoot, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function artifactKey(filePath) {
  return path.basename(filePath, ".md");
}

function approvedArtifact(content) {
  const normalized = stripDiacritics(content.toLowerCase());
  return normalized.includes("estado actual | aprobado") || normalized.includes("aprobacion del usuario | aprobada");
}

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function artifactDrift(projectRoot, filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const key = artifactKey(filePath);
  const anchors = ARTIFACT_REQUIRED_ANCHORS[key] ?? ["## Metadatos"];
  const drift = [];

  if (!/^#\s+.+/m.test(content)) {
    drift.push("falta H1");
  }
  for (const field of COMMON_METADATA_FIELDS) {
    if (!content.includes(`| ${field} |`)) {
      drift.push(`falta metadato ${field}`);
    }
  }
  for (const anchor of anchors) {
    if (!content.includes(anchor)) {
      drift.push(`falta sección ${anchor}`);
    }
  }

  return {
    file: normalizeRelativePath(path.relative(projectRoot, filePath)),
    approved: approvedArtifact(content),
    drift
  };
}

function reportArtifactDrift(projectRoot, summary) {
  const files = fromZeroArtifactFiles(projectRoot);
  if (files.length === 0) {
    summary.push("drift: no hay artefactos FROMZERO_* existentes que reconciliar");
    return;
  }

  let driftCount = 0;
  for (const file of files) {
    const result = artifactDrift(projectRoot, file);
    if (result.drift.length === 0) {
      summary.push(`drift: ${result.file} sin drift estructural detectado`);
      continue;
    }
    driftCount += 1;
    const mode = result.approved ? "aprobado; no reescribir sin re-aprobación" : "revisar antes de aprobar";
    summary.push(`drift: ${result.file}: ${result.drift.join("; ")} (${mode})`);
  }

  if (driftCount > 0) {
    summary.push("drift: reporte informativo; init-project no reescribe artefactos FROMZERO_* aprobados");
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = path.resolve(args.project);
  const outputPath = path.join(projectRoot, START_HERE_PATH);
  const templatePath = path.join(adapterRoot, "templates", "start-here.md");

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing template: ${templatePath}`);
  }

  if (!fs.existsSync(projectRoot)) {
    throw new Error(`Project path does not exist: ${projectRoot}`);
  }

  const appName = detectApp(args.app);
  const version = readVersion();
  const pluginPath = defaultPluginPath(projectRoot, appName);
  const summary = [];
  const startHereAlreadyExists = fs.existsSync(outputPath);

  const template = fs.readFileSync(templatePath, "utf8");
  const rendered = renderTemplate(template, {
    APP_NAME: appName,
    APP_NAME_UPPER: appName.toUpperCase(),
    ADAPTER_VERSION: version,
    PLUGIN_PATH: pluginPath,
    DEFAULT_DOCS_PATH: args.docs,
    GIT_STATUS: gitStatus(projectRoot).templateStatus
  });

  if (args.dryRun) {
    summary.push(`start-here: dry-run sobrescribiría ${outputPath}`);
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${rendered.trimEnd()}\n`, "utf8");
    summary.push(startHereAlreadyExists ? `start-here: sobrescrito ${outputPath}` : `start-here: generado ${outputPath}`);
  }

  if (!args.skipRules) {
    writeRulesFile(projectRoot, appName, version, pluginPath, summary, { dryRun: args.dryRun });
  }

  if (!args.skipAgentDir && appName.toLowerCase() === "antigravity") {
    materializeAgentDir(projectRoot, summary, {
      dryRun: args.dryRun,
      forceAgentDir: args.forceAgentDir,
      version,
      appName
    });
  }

  reportArtifactDrift(projectRoot, summary);

  for (const line of summary) {
    console.log(line);
  }

  if (!args.dryRun) {
    console.log(completionMessage(appName, outputPath, version, projectRoot));
  }
}

main();
