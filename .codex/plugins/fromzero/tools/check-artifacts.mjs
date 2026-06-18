#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

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

const ARTIFACTS_DIR = "artifacts";

const AUXILIARY_ARTIFACT_OUTPUT_DIRS = new Map([
  ["ADR", `${ARTIFACTS_DIR}/adr/`],
  ["Test Plan", `${ARTIFACTS_DIR}/test-plans/`],
  ["Handoff", `${ARTIFACTS_DIR}/handoffs/`],
  ["Issue", `${ARTIFACTS_DIR}/issues/`],
  ["k6 Scenario", `${ARTIFACTS_DIR}/k6/`],
  ["Module Spec", `${ARTIFACTS_DIR}/module-specs/`],
  ["Gotchas", `${ARTIFACTS_DIR}/fromzero-feedback/`],
  ["Methodology Feedback", `${ARTIFACTS_DIR}/fromzero-feedback/`]
]);

const AUXILIARY_ARTIFACT_NAMES = new Map([
  ["adr", "ADR"],
  ["test plan", "Test Plan"],
  ["handoff", "Handoff"],
  ["issue", "Issue"],
  ["k6 scenario", "k6 Scenario"],
  ["module spec", "Module Spec"],
  ["gotchas", "Gotchas"],
  ["methodology feedback", "Methodology Feedback"]
]);

const REQUIRED_SECTIONS = {
  FROMZERO_CONTEXT: [
    "## Metadatos",
    "## Fuentes del insumo",
    "## Entendimiento inicial del proyecto",
    "## Usuarios objetivo y no objetivo",
    "## Supuestos del agente",
    "## Confirmación de contexto",
    "## Análisis crítico del insumo",
    "## Inventario de capacidades del insumo",
    "## Inventario atomico de requisitos",
    "## Inventario de invariantes y gates"
  ],
  FROMZERO_QUESTIONNAIRE: [
    "## Metadatos",
    "## Estado general",
    "## Resumen de entendimiento antes de preguntar",
    "## Entrevista por ciclos",
    "## Resumen validado para Spec",
    "## Revisión y aprobación",
    "## Registro de cambios"
  ],
  FROMZERO_SPEC: [
    "## Metadatos",
    "## Resumen para el dueño",
    "## Fuentes",
    "## Decisiones del cuestionario",
    "## Matriz de cobertura del insumo",
    "## Matriz de requisitos atomicos",
    "## Matriz de invariantes y gates",
    "## Base para planificación",
    "## Aprobación"
  ],
  FROMZERO_PLAN: [
    "## Metadatos",
    "## Resumen para el dueño",
    "## 1. Reglas de ejecución",
    "## 2. Estado inicial",
    "## 3. Recursos y herramientas",
    "## 4. Verificaciones externas",
    "## 5.5 Conteo de cobertura REQ/GATE",
    "### Revisión adversarial complementaria",
    "## 5.6 Contraste de decisiones Questionnaire -> Spec -> Plan",
    "## 9. Validación de cierre",
    "## 10. Siguiente aprobación"
  ],
  FROMZERO_STATE: [
    "## Metadatos",
    "## Resumen para el dueño",
    "## 1. Estado general",
    "## 4.1 Commits previos relevantes",
    "## 6.1 Historial de aprobaciones",
    "## 6.2 Compatibilidad de estados y aprobaciones",
    "## 8. Próxima acción",
    "## 9. Reglas de actualización"
  ],
  START_HERE: [
    "## Metadatos",
    "## Estado de instalación",
    "## 1. Prepara control de versiones",
    "## 2. Elige como quieres empezar"
  ],
  ADR: [
    "## Metadatos",
    "## Decisión",
    "## Contexto",
    "## Opciones",
    "## Tradeoffs",
    "## Impacto seguridad",
    "## Impacto escalabilidad",
    "## Resultado"
  ],
  "Test Plan": [
    "## Metadatos",
    "## Unit",
    "## Integration",
    "## RLS/RBAC",
    "## Playwright",
    "## Visual",
    "## k6",
    "## Limitaciones"
  ],
  Handoff: [
    "## Metadatos",
    "## Aceptación de producto",
    "## Cambios",
    "## Plan",
    "## Verificación",
    "## Verificaciones",
    "## Riesgos",
    "## Issues",
    "## Siguientes pasos"
  ],
  Issue: [
    "## Metadatos",
    "## Contexto",
    "## Objetivo",
    "## Alcance",
    "## Fuera de alcance",
    "## Sprint asociado",
    "## Dependencias",
    "## Verificaciones requeridas",
    "## Condiciones de activación",
    "## Criterios de aceptación",
    "## Evidencia esperada",
    "## Riesgos"
  ],
  "k6 Scenario": [
    "## Metadatos",
    "## Flujo",
    "## Carga esperada",
    "## Thresholds",
    "## Datos",
    "## Riesgos"
  ],
  "Module Spec": [
    "## Metadatos",
    "## Módulo",
    "## Datos",
    "## Tenant ownership",
    "## RBAC",
    "## UI",
    "## Cache",
    "## Jobs",
    "## Queries",
    "## Tests",
    "## Riesgos"
  ],
  Gotchas: [
    "## Metadatos",
    "## Reglas de captura",
    "## Gotchas detectados",
    "## Pendientes de sanitización",
    "## Export manual"
  ],
  "Methodology Feedback": [
    "## Metadatos",
    "## Resumen para FromZero",
    "## Gotchas incluidos",
    "## Sanitización y autorización",
    "## Clasificación sugerida",
    "## Proceso manual recomendado"
  ]
};

const HUMAN_ZONE_STATES = new Set([
  "no aplica",
  "requiere aprobacion",
  "aprobada",
  "bloqueada"
]);

const LEGACY_STATE_MAP = new Map([
  ["aprobada", "aprobado"],
  ["actualizado en revision", "listo para revisión"],
  ["plan actualizado en revision", "listo para revisión"],
  ["en ejecucion", "en ejecución"],
  ["aprobado con correcciones", "requiere re-aprobación"],
  ["ajustada para revision con invariantes documentales", "requiere re-aprobación"]
]);

const CANONICAL_STATE_VALUES = new Set([
  "borrador",
  "borrador de preguntas",
  "en q&a",
  "respondido",
  "listo para revision",
  "aprobado",
  "requiere cambios",
  "requiere re-aprobacion",
  "activo",
  "bloqueado",
  "guia activa"
]);

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    strict: false,
    templates: false,
    semantic: false,
    selfTest: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      args.root = argv[++index];
    } else if (arg === "--strict") {
      args.strict = true;
    } else if (arg === "--templates") {
      args.templates = true;
    } else if (arg === "--semantic") {
      args.semantic = true;
    } else if (arg === "--self-test") {
      args.selfTest = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Argumento desconocido: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  process.stdout.write(`FromZero artifact checker

Usage:
  node tools/check-artifacts.mjs --root <project-path>
  node tools/check-artifacts.mjs --root <project-path> --strict
  node tools/check-artifacts.mjs --root <project-path> --semantic
  node tools/check-artifacts.mjs --root <repo-path> --templates --strict
  node tools/check-artifacts.mjs --self-test

Flags:
  --root <path>   Project or repository root to inspect.
  --strict        Treat structural drift as blocking.
  --templates     Validate packaged templates under core/templates.
  --semantic      Run deterministic semantic checks on project artifacts.
  --self-test     Run internal regression fixtures.
  --help, -h      Show this help.

Notes:
  - Project mode skips packaged templates; validate them with --templates --strict.
  - --semantic checks real project artifacts, not template placeholder rows.
  - The checker never reads .env files directly.
`);
}

function normalize(value) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeToken(value) {
  return stripDiacritics(value.toLowerCase())
    .replace(/[.;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function listMarkdownFiles(root) {
  if (!fs.existsSync(root)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "dist", "build"].includes(entry.name)) {
        continue;
      }
      files.push(...listMarkdownFiles(absolutePath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(absolutePath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function detectArtifact(relativePath, content) {
  const fileName = path.basename(relativePath);
  if (fileName === "START_HERE.md" || fileName === "start-here.md") {
    return "START_HERE";
  }

  const fromzero = fileName.match(/^(FROMZERO_[A-Z_]+)\.md$/);
  if (fromzero) {
    return fromzero[1];
  }

  const title = content.match(/^#\s+([A-Za-z0-9_ -]+)/m)?.[1]?.trim();
  if (title === "FROMZERO_CONTEXT") return "FROMZERO_CONTEXT";
  if (title === "FROMZERO_QUESTIONNAIRE") return "FROMZERO_QUESTIONNAIRE";
  if (title === "FROMZERO_SPEC") return "FROMZERO_SPEC";
  if (title === "FROMZERO_PLAN") return "FROMZERO_PLAN";
  if (title === "FROMZERO_STATE") return "FROMZERO_STATE";

  if (isNewStructuredArtifact(content)) {
    const artifactName = AUXILIARY_ARTIFACT_NAMES.get(normalizeToken(metadataValue(content, "Artefacto")));
    if (artifactName) {
      return artifactName;
    }
  }

  return null;
}

function hasCommonMetadata(content) {
  return /^#\s+.+/m.test(content) && content.includes("## Metadatos");
}

function metadataValue(content, field) {
  const expected = normalizeToken(field);
  for (const line of content.split("\n")) {
    if (!line.trim().startsWith("|")) {
      continue;
    }
    const cells = markdownTableCells(line);
    if (cells.length >= 2 && normalizeToken(cells[0]) === expected) {
      return cells[1].trim();
    }
  }
  return "";
}

function markdownTableCells(line) {
  const cells = [];
  let cell = "";
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = line[index - 1];
    if (char === "|" && previous !== "\\") {
      cells.push(cell.replaceAll("\\|", "|").trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell.replaceAll("\\|", "|").trim());
  return cells.filter((value, index, array) => !(value === "" && (index === 0 || index === array.length - 1)));
}

function isApprovedOrReapproved(content) {
  const state = normalizeToken(metadataValue(content, "Estado actual"));
  const approval = normalizeToken(metadataValue(content, "Aprobación del usuario"));
  if (state.includes("|") || approval.includes("|")) {
    return false;
  }
  return (
    state === "aprobado" ||
    state === "requiere re-aprobacion" ||
    approval === "aprobada"
  );
}

function isNewStructuredArtifact(content) {
  return hasCommonMetadata(content) && metadataValue(content, "Artefacto") !== "";
}

function validateMetadata(content, relativePath, issues) {
  for (const field of COMMON_METADATA_FIELDS) {
    if (!content.includes(`| ${field} |`)) {
      issues.errors.push(`${relativePath}: falta metadato común: ${field}`);
    }
  }

  if (!metadataValue(content, "Restricciones de seguridad").includes(".env")) {
    issues.errors.push(`${relativePath}: restricciones de seguridad debe mencionar .env reales`);
  }

  validateStateCompatibility(content, relativePath, issues);
}

function validateStateCompatibility(content, relativePath, issues) {
  const state = metadataValue(content, "Estado actual");
  if (!state || state.includes("|")) {
    return;
  }

  const normalized = normalizeToken(state);
  if (LEGACY_STATE_MAP.has(normalized)) {
    issues.warnings.push(`${relativePath}: estado legacy "${state}" se interpreta como "${LEGACY_STATE_MAP.get(normalized)}"`);
    return;
  }

  if (!CANONICAL_STATE_VALUES.has(normalized)) {
    issues.warnings.push(`${relativePath}: estado no canónico: ${state}`);
  }
}

function validateRequiredSections(content, artifact, relativePath, issues) {
  const required = REQUIRED_SECTIONS[artifact] ?? [];
  for (const section of required) {
    if (!content.includes(section)) {
      issues.errors.push(`${relativePath}: falta sección obligatoria: ${section}`);
    }
  }
}

function isPackagedTemplatePath(relativePath) {
  const normalizedPath = relativePath.replaceAll("\\", "/");
  return (
    normalizedPath.startsWith("core/templates/") ||
    normalizedPath.startsWith("templates/") ||
    /^adapters\/[^/]+\/templates\//.test(normalizedPath)
  );
}

function validateArtifactLocation(relativePath, artifact, issues, options) {
  if (options.templates || isPackagedTemplatePath(relativePath)) {
    return;
  }

  const normalizedPath = relativePath.replaceAll("\\", "/");
  const fileName = path.posix.basename(normalizedPath);
  const generatedArtifact =
    fileName === "START_HERE.md" ||
    /^FROMZERO_[A-Z_]+\.md$/.test(fileName);

  if (generatedArtifact && !normalizedPath.startsWith(`${ARTIFACTS_DIR}/`)) {
    issues.errors.push(`${relativePath}: artefacto generado debe vivir bajo ${ARTIFACTS_DIR}/`);
  }

  const requiredDir = AUXILIARY_ARTIFACT_OUTPUT_DIRS.get(artifact);
  if (requiredDir && !normalizedPath.startsWith(requiredDir)) {
    issues.errors.push(`${relativePath}: artefacto ${artifact} debe vivir bajo ${requiredDir}`);
  }
}

function validateQuestionnaire(content, relativePath, issues) {
  if (/^- [A-Z]\. /m.test(content) && !content.includes("Fuente documental:")) {
    issues.errors.push(`${relativePath}: opciones sin Fuente documental`);
  }

  const optionBlocks = content.split(/\n- [A-Z]\. /).slice(1);
  optionBlocks.forEach((block, index) => {
    const label = `opción ${index + 1}`;
    if (!block.includes("Fuente documental:")) {
      issues.errors.push(`${relativePath}: ${label} sin Fuente documental`);
    }
    const normalized = stripDiacritics(block.toLowerCase());
    if (
      normalized.includes("recomendacion: recomendada") &&
      normalized.includes("reduce, difiere o contradice el insumo: si")
    ) {
      issues.errors.push(`${relativePath}: ${label} recomendada reduce, difiere o contradice el insumo`);
    }
  });

  const jargon = [
    "fuente canónica",
    "referencia empaquetada",
    "template externo",
    "ruta interna",
    "manifest",
    "resolver",
    "lockfile"
  ];
  for (const term of jargon) {
    if (content.includes(term) && !content.includes("Notas internas")) {
      issues.errors.push(`${relativePath}: jerga visible sin aislar en notas internas: ${term}`);
    }
  }

  const technicalDecisionFields = [
    "Decisión en lenguaje común:",
    "Qué cambia si se elige:",
    "Impacto en costo/tiempo/riesgo:",
    "Cuándo conviene:",
    "Riesgo que evita:",
    "Nota técnica interna:"
  ];
  if (content.includes("decisión técnica") || content.includes("Tarjeta de decisión técnica:")) {
    for (const field of technicalDecisionFields) {
      if (!content.includes(field)) {
        issues.errors.push(`${relativePath}: tarjeta de decisión técnica sin campo: ${field}`);
      }
    }
  }
}

function validatePlan(content, relativePath, issues) {
  const normalized = stripDiacritics(content.toLowerCase());
  if (!normalized.includes("conteo de cobertura req/gate")) {
    issues.errors.push(`${relativePath}: falta conteo de cobertura REQ/GATE`);
  }
  if (!normalized.includes("revision adversarial complementaria")) {
    issues.errors.push(`${relativePath}: falta revisión adversarial complementaria`);
  }
  if (!/\|\s*REQ\s*\|/i.test(content) || !/\|\s*GATE\s*\|/i.test(content)) {
    issues.errors.push(`${relativePath}: conteo REQ/GATE sin filas REQ y GATE`);
  }
  validateCoverageCount(content, "REQ", relativePath, issues);
  validateCoverageCount(content, "GATE", relativePath, issues);
  if (normalized.includes("sin faltantes") && !normalized.includes("total detectado")) {
    issues.errors.push(`${relativePath}: declara sin faltantes sin conteos verificables`);
  }
  if (!content.includes("Apruebo el plan")) {
    issues.errors.push(`${relativePath}: falta frase recomendada de aprobación del plan`);
  }
  if (normalized.includes("continua con la ejecucion del proyecto") && !normalized.includes("solo reanuda un plan ya aprobado")) {
    issues.errors.push(`${relativePath}: frase de continuación sin condición de plan aprobado`);
  }
}

function validateCoverageCount(content, kind, relativePath, issues) {
  const match = content.match(new RegExp(`^\\|\\s*${kind}\\s*\\|([^\\n]+)$`, "im"));
  if (!match) {
    return;
  }

  const values = match[1]
    .split("|")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));

  if (values.length < 5) {
    issues.errors.push(`${relativePath}: conteo ${kind} incompleto`);
    return;
  }

  const [total, covered, pending, deferred, excluded] = values;
  if (total !== covered + pending + deferred + excluded) {
    issues.errors.push(`${relativePath}: conteo ${kind} no cuadra con cubiertos, pendientes, diferidos y excluidos`);
  }
  if (pending > 0) {
    issues.errors.push(`${relativePath}: conteo ${kind} mantiene pendientes sin resolver`);
  }
}

function validateSpec(content, relativePath, issues) {
  const normalized = stripDiacritics(content.toLowerCase());
  if (normalized.includes("contradiccion") && !normalized.includes("excepcion aprobada")) {
    issues.errors.push(`${relativePath}: contradicciones sin campo de excepción aprobada`);
  }
}

function validateArtifact(relativePath, content, artifact, options) {
  const issues = { errors: [], warnings: [] };
  const structured = isNewStructuredArtifact(content);
  const strict = options.strict || options.templates || isApprovedOrReapproved(content);

  validateArtifactLocation(relativePath, artifact, issues, options);

  if (!hasCommonMetadata(content)) {
    const message = `${relativePath}: drift, falta H1 o ## Metadatos`;
    if (strict) {
      issues.errors.push(message);
    } else {
      issues.warnings.push(message);
    }
    return issues;
  }

  validateMetadata(content, relativePath, issues);
  validateRequiredSections(content, artifact, relativePath, issues);

  if (artifact === "FROMZERO_QUESTIONNAIRE") {
    validateQuestionnaire(content, relativePath, issues);
  } else if (artifact === "FROMZERO_PLAN") {
    validatePlan(content, relativePath, issues);
  } else if (artifact === "FROMZERO_SPEC") {
    validateSpec(content, relativePath, issues);
  }

  if (structured && isApprovedOrReapproved(content)) {
    for (const field of ["Fecha de aprobación", "Frase literal de aprobación"]) {
      if (!metadataValue(content, field)) {
        issues.errors.push(`${relativePath}: artefacto aprobado sin ${field}`);
      }
    }
  }

  return issues;
}

function runCheck(root, options) {
  const failures = [];
  const warnings = [];
  const projectArtifacts = new Map();
  const files = options.templates
    ? listMarkdownFiles(path.join(root, "core", "templates"))
    : listMarkdownFiles(root);

  for (const absolutePath of files) {
    const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
    if (!options.templates && isPackagedTemplatePath(relativePath)) {
      continue;
    }
    const content = normalize(fs.readFileSync(absolutePath, "utf8"));
    const artifact = detectArtifact(relativePath, content);
    if (!artifact || !REQUIRED_SECTIONS[artifact]) {
      continue;
    }
    projectArtifacts.set(artifact, content);

    const result = validateArtifact(relativePath, content, artifact, options);
    failures.push(...result.errors);
    warnings.push(...result.warnings);
  }

  if (!options.templates) {
    failures.push(...validateCrossArtifactDecisions(projectArtifacts));
    if (options.semantic) {
      failures.push(...validateSemanticArtifacts(projectArtifacts));
    }
  }

  return { failures, warnings };
}

function validateCrossArtifactDecisions(artifacts) {
  const failures = [];
  const decisionSource = `${artifacts.get("FROMZERO_QUESTIONNAIRE") ?? ""}\n${artifacts.get("FROMZERO_SPEC") ?? ""}`;
  const plan = artifacts.get("FROMZERO_PLAN") ?? "";
  if (!decisionSource || !plan) {
    return failures;
  }

  const sourcePackageManager = selectedPackageManager(decisionSource);
  const planPackageManagers = packageManagers(plan);
  if (sourcePackageManager && planPackageManagers.length > 0 && !planPackageManagers.includes(sourcePackageManager)) {
    failures.push(`artifacts/FROMZERO_PLAN.md: package manager contradice decisión aprobada (${sourcePackageManager} vs ${planPackageManagers.join(", ")})`);
  }
  return failures;
}

function validateSemanticArtifacts(artifacts) {
  const failures = [];
  validateContextSourcesInSpec(artifacts, failures);
  validateSemanticArtifactContent("artifacts/FROMZERO_SPEC.md", artifacts.get("FROMZERO_SPEC") ?? "", failures);
  validateSemanticArtifactContent("artifacts/FROMZERO_PLAN.md", artifacts.get("FROMZERO_PLAN") ?? "", failures);
  return failures;
}

function validateContextSourcesInSpec(artifacts, failures) {
  const context = artifacts.get("FROMZERO_CONTEXT") ?? "";
  const spec = artifacts.get("FROMZERO_SPEC") ?? "";
  if (!context || !spec) {
    return;
  }

  const sources = extractContextSources(context);
  for (const source of sources) {
    if (!spec.includes(source)) {
      failures.push(`artifacts/FROMZERO_SPEC.md: fuente de Context no aparece en Spec: ${source}`);
    }
  }
}

function extractContextSources(content) {
  const section = sectionContent(content, "## Fuentes del insumo");
  if (!section) {
    return [];
  }

  const sources = new Set();
  for (const row of markdownRows(section)) {
    const first = row[0]?.trim();
    if (isConcreteCell(first) && !/^fuente$/i.test(stripDiacritics(first))) {
      sources.add(first);
    }
  }
  return [...sources];
}

function validateSemanticArtifactContent(relativePath, content, failures) {
  if (!content) {
    return;
  }

  validateNoAplicaReasons(relativePath, content, failures);
  validateHumanZones(relativePath, content, failures);
  validateSpecialistReviews(relativePath, content, failures);
  validateAutomationFilter(relativePath, content, failures);
}

function validateNoAplicaReasons(relativePath, content, failures) {
  for (const row of allTableRowsWithHeaders(content)) {
    const reasonIndexes = columnIndexes(row.headers, ["razon", "fallback"]);
    if (reasonIndexes.length === 0 || !row.cells.some((cell) => normalizeToken(cell) === "no aplica")) {
      continue;
    }
    const hasReason = reasonIndexes.some((index) => isConcreteCell(row.cells[index]));
    if (!hasReason) {
      failures.push(`${relativePath}: fila "no aplica" sin razón o fallback verificable`);
    }
  }
}

function validateHumanZones(relativePath, content, failures) {
  if (!content.includes("Zonas de validación humana")) {
    return;
  }

  for (const row of allTableRowsWithHeaders(content)) {
    const zoneIndex = columnIndex(row.headers, "zona");
    const stateIndex = columnIndex(row.headers, "estado");
    if (zoneIndex === -1 || stateIndex === -1 || !isConcreteCell(row.cells[zoneIndex])) {
      continue;
    }

    const state = normalizeToken(row.cells[stateIndex] ?? "");
    if (!HUMAN_ZONE_STATES.has(state)) {
      failures.push(`${relativePath}: zona humana sin estado permitido: ${row.cells[zoneIndex]}`);
    }

    const actionIndex = columnIndex(row.headers, "accion");
    if ((state === "requiere aprobacion" || state === "bloqueada") && actionIndex !== -1) {
      const action = normalizeToken(row.cells[actionIndex] ?? "");
      if (action === "continuar") {
        failures.push(`${relativePath}: zona humana pendiente no puede tener acción "continuar": ${row.cells[zoneIndex]}`);
      }
    }
  }
}

function validateSpecialistReviews(relativePath, content, failures) {
  if (!content.includes("Especialistas condicionales") && !content.includes("Revisión de especialistas")) {
    return;
  }

  for (const row of allTableRowsWithHeaders(content)) {
    const domainIndex = columnIndex(row.headers, "dominio");
    const conditionIndex = columnIndex(row.headers, "condicion");
    const modeIndex = columnIndexes(row.headers, ["modo"])[0] ?? -1;
    if (domainIndex === -1 || conditionIndex === -1 || modeIndex === -1 || !isConcreteCell(row.cells[domainIndex])) {
      continue;
    }

    const condition = normalizeToken(row.cells[conditionIndex] ?? "");
    if (condition !== "aplica") {
      continue;
    }

    const mode = normalizeToken(row.cells[modeIndex] ?? "");
    const fallbackIndexes = columnIndexes(row.headers, ["hallazgos", "decision", "fallback", "razon"]);
    const hasReviewOrFallback = fallbackIndexes.some((index) => isConcreteCell(row.cells[index]));
    if (!hasReviewOrFallback) {
      failures.push(`${relativePath}: dominio especialista aplicable sin revisión, decisión o fallback: ${row.cells[domainIndex]}`);
    }

    if (mode === "rol documental" && !hasReviewOrFallback) {
      failures.push(`${relativePath}: rol documental no puede contarse como revisión independiente sin fallback: ${row.cells[domainIndex]}`);
    }
  }
}

function validateAutomationFilter(relativePath, content, failures) {
  const normalized = stripDiacritics(content.toLowerCase());
  const mentionsAutomation = /\b(hooks?|loops?|schedules?|monitores?|jobs recurrentes?|procesos automatizados|cron)\b/.test(normalized);
  if (mentionsAutomation && !normalized.includes("automatizacion vs augmentacion")) {
    failures.push(`${relativePath}: menciona automatización sin filtro "Automatización vs augmentación"`);
  }
}

function sectionContent(content, heading) {
  const start = content.indexOf(heading);
  if (start === -1) {
    return "";
  }
  const next = content.slice(start + heading.length).search(/\n##\s+/);
  if (next === -1) {
    return content.slice(start + heading.length);
  }
  return content.slice(start + heading.length, start + heading.length + next);
}

function allTableRowsWithHeaders(content) {
  const rows = [];
  const lines = content.split("\n");
  let headers = null;
  let expectingSeparator = false;

  for (const line of lines) {
    if (!line.trim().startsWith("|")) {
      headers = null;
      expectingSeparator = false;
      continue;
    }

    const cells = markdownTableCells(line);
    if (expectingSeparator) {
      expectingSeparator = false;
      if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
        continue;
      }
    }

    if (!headers) {
      headers = cells;
      expectingSeparator = true;
      continue;
    }

    rows.push({ headers, cells });
  }

  return rows;
}

function markdownRows(content) {
  return content
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map(markdownTableCells)
    .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function columnIndex(headers, expected) {
  const normalizedExpected = stripDiacritics(expected.toLowerCase());
  return headers.findIndex((header) => stripDiacritics(header.toLowerCase()).includes(normalizedExpected));
}

function columnIndexes(headers, expectedValues) {
  return headers
    .map((header, index) => ({ header: stripDiacritics(header.toLowerCase()), index }))
    .filter((item) => expectedValues.some((expected) => item.header.includes(expected)))
    .map((item) => item.index);
}

function isConcreteCell(value) {
  const normalized = normalizeToken(value ?? "");
  return Boolean(normalized) && !/\s\/\s/.test(normalized) && normalized !== "-" && normalized !== "pendiente";
}

function selectedPackageManager(content) {
  const normalized = stripDiacritics(content.toLowerCase());
  const managers = packageManagers(content);
  if (managers.length === 0) {
    return null;
  }
  for (const manager of managers) {
    const pattern = new RegExp(`(respuesta seleccionada|aprob|decision|stack|lockfile)[\\s\\S]{0,120}\\b${manager}\\b`, "i");
    if (pattern.test(normalized)) {
      return manager;
    }
  }
  return null;
}

function packageManagers(content) {
  const normalized = stripDiacritics(content.toLowerCase());
  return ["npm", "pnpm", "yarn"].filter((manager) => new RegExp(`\\b${manager}\\b`).test(normalized));
}

function runSelfTest() {
  const cases = [
    {
      name: "artefacto sin encabezado común queda como drift",
      artifact: "FROMZERO_SPEC",
      path: "artifacts/FROMZERO_SPEC.md",
      strict: false,
      content: "# FROMZERO_SPEC\n\nEstado: borrador\n",
      expectedFailures: 0,
      expectedWarnings: 1
    },
    {
      name: "artefacto generado fuera de artifacts bloquea",
      artifact: "FROMZERO_SPEC",
      path: "FROMZERO_SPEC.md",
      strict: true,
      content: fixture("FROMZERO_SPEC"),
      expectedFailures: 1
    },
    {
      name: "artefacto auxiliar fuera de artifacts bloquea",
      artifact: "ADR",
      path: "ADR.md",
      strict: true,
      content: fixture("ADR"),
      expectedFailures: 1
    },
    {
      name: "template auxiliar empaquetado no bloquea ubicación",
      artifact: "ADR",
      path: "core/templates/adr.md",
      strict: true,
      content: fixture("ADR"),
      expectedFailures: 0
    },
    {
      name: "gotchas exportable bajo fromzero-feedback no bloquea",
      artifact: "Gotchas",
      path: "artifacts/fromzero-feedback/GOTCHAS.md",
      strict: true,
      content: fixture("Gotchas"),
      expectedFailures: 0,
      exactFailures: true
    },
    {
      name: "feedback metodológico fuera de fromzero-feedback bloquea",
      artifact: "Methodology Feedback",
      path: "artifacts/methodology-feedback.md",
      strict: true,
      content: fixture("Methodology Feedback"),
      expectedFailures: 1
    },
    {
      name: "cuestionario sin fuente por opción bloquea",
      artifact: "FROMZERO_QUESTIONNAIRE",
      path: "artifacts/FROMZERO_QUESTIONNAIRE.md",
      strict: true,
      content: fixture("FROMZERO_QUESTIONNAIRE").replaceAll("  Fuente documental:\n", ""),
      expectedFailures: 1
    },
    {
      name: "opción recomendada que contradice insumo bloquea",
      artifact: "FROMZERO_QUESTIONNAIRE",
      path: "artifacts/FROMZERO_QUESTIONNAIRE.md",
      strict: true,
      content: fixture("FROMZERO_QUESTIONNAIRE").replace(
        "Reduce, difiere o contradice el insumo: no",
        "Reduce, difiere o contradice el insumo: si"
      ),
      expectedFailures: 1
    },
    {
      name: "cuestionario sin resumen validado bloquea",
      artifact: "FROMZERO_QUESTIONNAIRE",
      path: "artifacts/FROMZERO_QUESTIONNAIRE.md",
      strict: true,
      content: fixture("FROMZERO_QUESTIONNAIRE").replace("## Resumen validado para Spec\n\n", ""),
      expectedFailures: 1
    },
    {
      name: "pregunta técnica sin tarjeta de decisión bloquea",
      artifact: "FROMZERO_QUESTIONNAIRE",
      path: "artifacts/FROMZERO_QUESTIONNAIRE.md",
      strict: true,
      content: fixture("FROMZERO_QUESTIONNAIRE").replace(/Tarjeta de decisión técnica:[\s\S]*?Opciones:\n/, "Opciones:\n"),
      expectedFailures: 1
    },
    {
      name: "pregunta no técnica sin tarjeta de decisión no bloquea",
      artifact: "FROMZERO_QUESTIONNAIRE",
      path: "artifacts/FROMZERO_QUESTIONNAIRE.md",
      strict: true,
      content: fixture("FROMZERO_QUESTIONNAIRE")
        .replace("Origen: decisión técnica\n\n", "Origen: gap documental\n\n")
        .replace(/Tarjeta de decisión técnica:[\s\S]*?Opciones:\n/, "Opciones:\n"),
      expectedFailures: 0
    },
    {
      name: "estado legacy reconocible no bloquea",
      artifact: "FROMZERO_SPEC",
      path: "artifacts/FROMZERO_SPEC.md",
      strict: true,
      content: `${fixture("FROMZERO_SPEC").replace("| Estado actual | borrador |", "| Estado actual | ajustada para revision con invariantes documentales |")}## Fuentes\n\n## Decisiones del cuestionario\n\n## Matriz de cobertura del insumo\n\n## Matriz de requisitos atomicos\n\n## Matriz de invariantes y gates\n\n## Aprobación\n`,
      expectedFailures: 0,
      expectedWarnings: 1
    },
    {
      name: "plan sin filas REQ/GATE bloquea",
      artifact: "FROMZERO_PLAN",
      path: "artifacts/FROMZERO_PLAN.md",
      strict: true,
      content: fixture("FROMZERO_PLAN").replace("| REQ | 0 | 0 | 0 | 0 | 0 |\n| GATE | 0 | 0 | 0 | 0 | 0 |\n", ""),
      expectedFailures: 1
    },
    {
      name: "spec sin base para planificación bloquea",
      artifact: "FROMZERO_SPEC",
      path: "artifacts/FROMZERO_SPEC.md",
      strict: true,
      content: fixture("FROMZERO_SPEC").replace("## Base para planificación\n\n", ""),
      expectedFailures: 1
    },
    {
      name: "plan con REQ pendiente bloquea aunque tenga revisión adversarial",
      artifact: "FROMZERO_PLAN",
      path: "artifacts/FROMZERO_PLAN.md",
      strict: true,
      content: fixture("FROMZERO_PLAN").replace("| REQ | 0 | 0 | 0 | 0 | 0 |", "| REQ | 1 | 0 | 1 | 0 | 0 |"),
      expectedFailures: 1
    },
    {
      name: "npm aprobado y pnpm en plan bloquea",
      cross: true,
      artifacts: new Map([
        ["FROMZERO_QUESTIONNAIRE", "Respuesta seleccionada: npm\nAprobación del usuario: aprobada\n"],
        ["FROMZERO_PLAN", "Usar pnpm install\n"]
      ]),
      expectedFailures: 1
    },
    {
      name: "semantic detecta fuente de Context omitida en Spec",
      semantic: true,
      artifacts: new Map([
        ["FROMZERO_CONTEXT", `${fixture("FROMZERO_CONTEXT")}## Fuentes del insumo\n\n| Fuente | Estado |\n|---|---|\n| docs/PRD.md | leída |\n`],
        ["FROMZERO_SPEC", fixture("FROMZERO_SPEC")]
      ]),
      expectedFailures: 1
    },
    {
      name: "semantic detecta automatización sin filtro",
      semantic: true,
      artifacts: new Map([
        ["FROMZERO_SPEC", `${fixture("FROMZERO_SPEC")}\nEl proyecto crea hooks y schedules de ejecución.\n`]
      ]),
      expectedFailures: 1
    },
    {
      name: "semantic detecta zona humana pendiente con continuar",
      semantic: true,
      artifacts: new Map([
        ["FROMZERO_PLAN", `${fixture("FROMZERO_PLAN")}\n## 5.7 Controles condicionales de riesgo\n\n### 5.7.2 Zonas de validación humana por Sprint\n\n| Sprint | Zona | Condición de activación | Estado | Aprobación o razón | Acción antes de Build |\n|---|---|---|---|---|---|\n| Sprint 1 | permisos/RLS/RBAC | RLS nueva | requiere aprobación | pendiente de usuario | continuar |\n`]
      ]),
      expectedFailures: 1
    },
    {
      name: "semantic acepta condicional no aplicable con razón",
      semantic: true,
      artifacts: new Map([
        ["FROMZERO_PLAN", `${fixture("FROMZERO_PLAN")}\n## 5.7 Controles condicionales de riesgo\n\n### 5.7.2 Zonas de validación humana por Sprint\n\n| Sprint | Zona | Condición de activación | Estado | Aprobación o razón | Acción antes de Build |\n|---|---|---|---|---|---|\n| Sprint 1 | billing/pagos/webhooks | no hay pagos | no aplica | proyecto sin cobros | continuar |\n`]
      ]),
      expectedFailures: 0,
      exactFailures: true
    }
  ];

  const failed = [];
  for (const testCase of cases) {
    if (testCase.cross) {
      const result = validateCrossArtifactDecisions(testCase.artifacts);
      if (result.length < testCase.expectedFailures) {
        failed.push(`${testCase.name}: errores=${result.length}`);
      }
      continue;
    }
    if (testCase.semantic) {
      const result = validateSemanticArtifacts(testCase.artifacts);
      if (testCase.exactFailures ? result.length !== testCase.expectedFailures : result.length < testCase.expectedFailures) {
        failed.push(`${testCase.name}: errores=${result.length}`);
      }
      continue;
    }
    const result = validateArtifact(testCase.path, testCase.content, testCase.artifact, {
      strict: testCase.strict,
      templates: false
    });
    const failureMismatch = testCase.exactFailures
      ? result.errors.length !== testCase.expectedFailures
      : result.errors.length < testCase.expectedFailures;
    if (failureMismatch || result.warnings.length < (testCase.expectedWarnings ?? 0)) {
      failed.push(`${testCase.name}: errores=${result.errors.length}, warnings=${result.warnings.length}`);
    }
  }

  if (failed.length > 0) {
    console.error(failed.join("\n"));
    process.exit(1);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "fromzero-check-artifacts-"));
  try {
    const templateDir = path.join(tempRoot, "core", "templates");
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(
      path.join(templateDir, "spec.md"),
      `${fixture("FROMZERO_SPEC")}\n## Zonas de validación humana\n\n| Zona | Estado |\n|---|---|\n| auth/sesiones | no aplica / requiere aprobación / aprobada / bloqueada |\n`,
      "utf8"
    );
    const semanticResult = runCheck(tempRoot, { strict: false, templates: false, semantic: true });
    if (semanticResult.failures.length > 0) {
      console.error(`semantic ignora templates empaquetados: errores=${semanticResult.failures.length}`);
      process.exit(1);
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log("Self-test de check-artifacts pasó.");
}

function fixture(artifact) {
  const metadata = [
    `# ${artifact}`,
    "",
    "## Metadatos",
    "",
    "| Campo | Valor |",
    "|---|---|",
    `| Artefacto | ${artifact} |`,
    "| Propósito o subtítulo | prueba |",
    "| Proyecto | prueba |",
    "| Versión del adaptador FromZero | 0.0.0 |",
    "| Fecha de creación | 2026-01-01 |",
    "| Última actualización | 2026-01-01 |",
    "| Estado actual | borrador |",
    "| Historial de estados |  |",
    "| Aprobación del usuario | pendiente |",
    "| Fecha de aprobación |  |",
    "| Frase literal de aprobación |  |",
    "| Artefactos prerequisito |  |",
    "| Documentos o fuentes asociadas |  |",
    "| Artefactos derivados o relacionados |  |",
    "| Commit asociado |  |",
    "| Restricciones de seguridad | Sin secretos ni `.env` reales. |",
    ""
  ].join("\n");

  if (artifact === "FROMZERO_QUESTIONNAIRE") {
    return `${metadata}## Estado general\n\n- Modo Q&A ejecutado: si\n\n## Resumen de entendimiento antes de preguntar\n\n## Entrevista por ciclos\n\n## Q001 - Pregunta\n\nOrigen: decisión técnica\n\nTarjeta de decisión técnica:\n\n- Decisión en lenguaje común:\n- Qué cambia si se elige:\n- Impacto en costo/tiempo/riesgo:\n- Cuándo conviene:\n- Riesgo que evita:\n- Nota técnica interna:\n\nOpciones:\n\n- A. Opción recomendada\n  Fuente documental:\n  Impacto:\n  Ayuda visible:\n  Recomendación: recomendada\n  Reduce, difiere o contradice el insumo: no\n\n## Resumen validado para Spec\n\n## Revisión y aprobación\n\n## Registro de cambios\n`;
  }

  if (artifact === "FROMZERO_PLAN") {
    return `${metadata}## 1. Reglas de ejecución\n\n## 2. Estado inicial\n\n## 3. Recursos y herramientas\n\n## 4. Verificaciones externas\n\n## 5.5 Conteo de cobertura REQ/GATE\n\n| Tipo | Total detectado | Cubiertos | Pendientes | Diferidos con razón | Excluidos con razón |\n|---|---:|---:|---:|---:|---:|\n| REQ | 0 | 0 | 0 | 0 | 0 |\n| GATE | 0 | 0 | 0 | 0 | 0 |\n\n### Revisión adversarial complementaria\n\n| Muestra determinística | Fuente | Item revisado | Resultado | Gap detectado | Acción |\n|---|---|---|---|---|---|\n| 1 |  |  | cubierto |  |  |\n\n## 5.6 Contraste de decisiones Questionnaire -> Spec -> Plan\n\n## 9. Validación de cierre\n\n## 10. Siguiente aprobación\n\nApruebo el plan\n`;
  }

  if (artifact === "ADR") {
    return `${metadata}## Decisión\n\n## Contexto\n\n## Opciones\n\n## Tradeoffs\n\n## Impacto seguridad\n\n## Impacto escalabilidad\n\n## Resultado\n`;
  }

  if (artifact === "Gotchas") {
    return `${metadata}## Reglas de captura\n\n## Gotchas detectados\n\n## Pendientes de sanitización\n\n## Export manual\n`;
  }

  if (artifact === "Methodology Feedback") {
    return `${metadata}## Resumen para FromZero\n\n## Gotchas incluidos\n\n## Sanitización y autorización\n\n## Clasificación sugerida\n\n## Proceso manual recomendado\n`;
  }

  if (artifact === "FROMZERO_SPEC") {
    return `${metadata}## Fuentes\n\n## Decisiones del cuestionario\n\n## Matriz de cobertura del insumo\n\n## Matriz de requisitos atomicos\n\n## Matriz de invariantes y gates\n\n## Base para planificación\n\n## Aprobación\n`;
  }

  return metadata;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    runSelfTest();
    return;
  }

  const root = path.resolve(args.root);
  const result = runCheck(root, args);
  for (const warning of result.warnings) {
    console.warn(`drift: ${warning}`);
  }
  if (result.failures.length > 0) {
    console.error(result.failures.join("\n"));
    process.exit(1);
  }
  console.log(`Artefactos FromZero verificados. Drift reportado: ${result.warnings.length}.`);
}

main();
