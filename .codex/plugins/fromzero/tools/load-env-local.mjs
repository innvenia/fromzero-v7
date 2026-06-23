#!/usr/bin/env node
// Controlled Secret Runtime Access engine for the FromZero methodology.
//
// Purpose: make the secrets a person already placed in `.env.local` usable by the
// agent and its subagents to operate the project TechStack (CLIs, direct HTTP
// APIs, SDKs) WITHOUT ever printing, copying, logging or versioning those values.
// Access is scoped per project and per command: the agent loads `.env.local` only
// at the moment it runs a tool, inside that command, so nothing is persisted to
// the global OS environment and projects never mix. It never reads `.env` for
// scanning and never emits secret values to stdout.
//
// Modes:
//   (default, status)   node tools/load-env-local.mjs [--project <path>]
//       Prints only variable NAMES and `<NAME>_set: true|false`. Never values.
//   run                 node tools/load-env-local.mjs -- <command> [args...]
//       Loads `.env.local` (with SonarQube aliases) into the environment of the
//       spawned command only, then runs it. The agent uses this within the
//       session for CLI/API tools; it never prints values. This is the
//       within-session mechanism for Codex and Antigravity (no launcher, no
//       config edit, normal app icon).
//   --setup <platform>  Ensure `.env.local` exists and drop a plain README.
//   --verify <platform> Report end state (exists, git-ignored, names present).
//   --claude-env-file   Internal: append `export <NAME>=<value>` to CLAUDE_ENV_FILE
//       (Claude Code SessionStart hook). Values go to that private session file.
//   programmatic        import { loadEnvLocal } from ".../load-env-local.mjs"
//
// Guardrails: confined to the target project (never $HOME or other projects);
// never prints values.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Minimal SonarQube aliases. The canonical methodology names are SONARQUBE_*,
// but the SonarScanner CLI reads SONAR_*. We mirror each pair both ways so a
// project that filled either side works without duplicating variables.
const ALIAS_PAIRS = [
  ["SONARQUBE_TOKEN", "SONAR_TOKEN"],
  ["SONARQUBE_URL", "SONAR_HOST_URL"],
  ["SONARQUBE_PROJECT_KEY", "SONAR_PROJECT_KEY"]
];

function parseArgs(argv) {
  const args = {
    project: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    mode: "status",
    platform: "",
    command: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      args.mode = "run";
      args.command = argv.slice(index + 1);
      break;
    } else if (arg === "--project") {
      args.project = argv[++index];
    } else if (arg === "--claude-env-file") {
      args.mode = "claude-env-file";
    } else if (arg === "--status") {
      args.mode = "status";
    } else if (arg === "--setup") {
      args.mode = "setup";
      args.platform = String(argv[++index] || "").toLowerCase();
    } else if (arg === "--verify") {
      args.mode = "verify";
      args.platform = String(argv[++index] || "").toLowerCase();
    } else if (arg === "--help" || arg === "-h") {
      args.mode = "help";
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

// Parse a dotenv-style file into ordered [name, value] entries. Supports
// `export ` prefixes, single/double quotes and inline-comment trimming for
// unquoted values. Never throws on malformed lines; it skips them.
function parseEnv(content) {
  const entries = [];
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const withoutExport = line.startsWith("export ") ? line.slice(7).trim() : line;
    const eq = withoutExport.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const name = withoutExport.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      continue;
    }

    let value = withoutExport.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    } else {
      const hash = value.indexOf(" #");
      if (hash !== -1) {
        value = value.slice(0, hash).trim();
      }
    }

    entries.push([name, value]);
  }

  return entries;
}

// Add a missing alias from its present counterpart, in both directions.
function applyAliases(map) {
  for (const [canonical, alias] of ALIAS_PAIRS) {
    const hasCanonical = map.has(canonical) && map.get(canonical) !== "";
    const hasAlias = map.has(alias) && map.get(alias) !== "";
    if (hasCanonical && !hasAlias) {
      map.set(alias, map.get(canonical));
    } else if (hasAlias && !hasCanonical) {
      map.set(canonical, map.get(alias));
    }
  }
}

function envLocalPath(projectRoot) {
  return path.join(path.resolve(projectRoot), ".env.local");
}

function readEnvMap(projectRoot) {
  const filePath = envLocalPath(projectRoot);
  const map = new Map(fs.existsSync(filePath) ? parseEnv(fs.readFileSync(filePath, "utf8")) : []);
  applyAliases(map);
  return map;
}

// Returns "ignored" | "not-ignored" | "unknown".
function gitIgnoreStatus(projectRoot) {
  const result = spawnSync("git", ["-C", projectRoot, "check-ignore", "-q", ".env.local"], {
    encoding: "utf8"
  });
  if (result.error) {
    return "unknown";
  }
  if (result.status === 0) {
    return "ignored";
  }
  if (result.status === 1) {
    return "not-ignored";
  }
  return "unknown";
}

// Public API for Node scripts (API/SDK). Populates process.env by default.
// Never returns or logs secret values.
export function loadEnvLocal({ project, mutateProcessEnv = true } = {}) {
  const projectRoot = project || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const filePath = envLocalPath(projectRoot);
  const result = { names: [], present: {}, loaded: false, file: filePath };

  if (!fs.existsSync(filePath)) {
    return result;
  }

  const map = readEnvMap(projectRoot);
  for (const [name, value] of map.entries()) {
    result.names.push(name);
    result.present[name] = value !== "";
    if (mutateProcessEnv && process.env[name] === undefined) {
      process.env[name] = value;
    }
  }
  result.loaded = true;
  return result;
}

function posixSingleQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

// Within-session runner: load `.env.local` into the spawned command's environment
// only, then run it. Never prints values. This is how the agent uses the project
// secrets in Codex and Antigravity without launchers, config edits or global env.
function runCommand(command, projectRoot, out) {
  if (!command || command.length === 0) {
    out("Falta el comando. Uso: node tools/load-env-local.mjs -- <comando> [args...]");
    process.exitCode = 2;
    return;
  }

  const env = { ...process.env };
  for (const [name, value] of readEnvMap(projectRoot).entries()) {
    if (value !== "") {
      env[name] = value;
    }
  }

  // Run the full command line through the shell so Windows .cmd shims (npx,
  // supabase, sonar-scanner) resolve. Passing a string (not an args array)
  // avoids the shell-with-args deprecation and matches how a person types it.
  const result = spawnSync(command.join(" "), { stdio: "inherit", env, shell: true });
  if (result.error) {
    out("No se pudo ejecutar el comando.");
    process.exitCode = 1;
    return;
  }
  process.exitCode = result.status === null ? 1 : result.status;
}

function reportStatus(projectRoot, map, ignoreStatus, out) {
  out(`Variables locales detectadas en ${envLocalPath(projectRoot)} (sin mostrar valores):`);
  if (map.size === 0) {
    out("  (ninguna)");
  }
  for (const [name, value] of map.entries()) {
    out(`  ${name}_set: ${value !== "" ? "true" : "false"}`);
  }
  if (ignoreStatus === "not-ignored") {
    out("Aviso: .env.local NO esta ignorado por Git. Agregalo a .gitignore antes de usarlo.");
  } else if (ignoreStatus === "unknown") {
    out("Aviso: no se pudo verificar que .env.local este ignorado por Git.");
  }
}

function writeFileEnsured(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function readEnvNames(projectRoot) {
  for (const file of [".env.local", ".env.example"]) {
    const p = path.join(projectRoot, file);
    if (fs.existsSync(p)) {
      const map = new Map(parseEnv(fs.readFileSync(p, "utf8")));
      applyAliases(map);
      return { source: file, names: [...map.keys()] };
    }
  }
  return { source: null, names: [] };
}

function claudeReadme() {
  return [
    "Acceso a tus variables locales (.env.local) en Claude Code",
    "==========================================================",
    "Automatico: el plugin carga .env.local al iniciar la sesion.",
    "1. Completa .env.local con tus valores.",
    "2. Reinicia la sesion del agente. Listo.",
    ""
  ].join("\n");
}

function withinSessionReadme(appName) {
  return [
    "Acceso a tus variables locales (.env.local) en " + appName,
    "==========================================================",
    "Abre " + appName + " con tu icono normal. No necesitas lanzadores ni configurar nada.",
    "",
    "1. Completa .env.local con tus valores.",
    "2. Pidele al agente lo que necesites (ej: \"consulta SonarQube\").",
    "",
    "El agente carga .env.local solo al ejecutar cada herramienta, dentro de la sesion,",
    "scoped a este proyecto. Tus secretos no se muestran, no se guardan globales y no se mezclan.",
    ""
  ].join("\n");
}

const PLATFORMS = {
  codex: "codex",
  "claude-code": "claude-code",
  claude: "claude-code",
  antigravity: "antigravity",
  gemini: "antigravity"
};

function setupPlatform(platform, projectRoot, out) {
  const target = PLATFORMS[platform];
  if (!target) {
    out("Plataforma no reconocida. Usa: --setup codex | claude-code | antigravity.");
    return;
  }

  // Ensure .env.local exists from .env.example (never overwrite an existing file).
  const envLocal = envLocalPath(projectRoot);
  const envExample = path.join(projectRoot, ".env.example");
  let created = false;
  if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envLocal);
    created = true;
  }

  const readme = target === "claude-code"
    ? claudeReadme()
    : withinSessionReadme(target === "codex" ? "Codex" : "Antigravity");
  writeFileEnsured(path.join(projectRoot, ".fromzero", "secret-access", "README.txt"), readme);

  const { source, names } = readEnvNames(projectRoot);
  out("Acceso a secretos preparado para " + target + " (sin valores):");
  if (created) {
    out("  .env.local creado desde .env.example (completalo con tus valores).");
  }
  out("  .fromzero/secret-access/README.txt");
  if (gitIgnoreStatus(projectRoot) === "not-ignored") {
    out("  Aviso: agrega .env.local a .gitignore.");
  }
  if (source) {
    out("  Variables detectadas en " + source + ": " + (names.length ? names.join(", ") : "(ninguna)"));
  }
  out("Siguiente paso: completa .env.local; el agente usara tus herramientas dentro de la sesion.");
}

// Deterministic doctor: checks the end state and prints a single next step.
function verifyAccess(platform, projectRoot, out) {
  const target = PLATFORMS[platform];
  if (!target) {
    out("Plataforma no reconocida. Usa: --verify codex | claude-code | antigravity.");
    return;
  }

  const filePath = envLocalPath(projectRoot);
  const hasEnv = fs.existsSync(filePath);
  let names = [];
  if (hasEnv) {
    names = [...readEnvMap(projectRoot).entries()].filter(([, value]) => value !== "").map(([name]) => name);
  }

  const checks = [
    [".env.local existe", hasEnv],
    [".env.local ignorado por Git", gitIgnoreStatus(projectRoot) === "ignored"],
    ["variables con valor presentes", names.length > 0]
  ];

  out("Verificacion de acceso (" + target + "):");
  let allOk = true;
  for (const [label, ok] of checks) {
    out("  [" + (ok ? "OK" : "PENDIENTE") + "] " + label);
    if (!ok) {
      allOk = false;
    }
  }
  if (names.length) {
    out("  Variables: " + names.map((name) => name + "_set:true").join(", "));
  }

  if (!allOk) {
    out("Faltan pasos: completa .env.local y agregalo a .gitignore.");
  } else if (target === "claude-code") {
    out("Listo. Reinicia la sesion del agente (el hook carga .env.local).");
  } else {
    out("Listo. Abre el agente normal; usara tus variables dentro de la sesion.");
  }
}

function printHelp(out) {
  out(
    [
      "load-env-local.mjs — Controlled Secret Runtime Access",
      "",
      "Uso:",
      "  node tools/load-env-local.mjs [--project <ruta>]      Reporta nombres y estado (sin valores).",
      "  node tools/load-env-local.mjs -- <comando> [args...]  Ejecuta el comando con .env.local cargado (dentro de la sesion).",
      "  node tools/load-env-local.mjs --setup <plataforma>    Prepara .env.local y deja el README.",
      "  node tools/load-env-local.mjs --verify <plataforma>   Revisa el estado y dice el paso restante.",
      "  node tools/load-env-local.mjs --claude-env-file       Interno: carga .env.local en Claude Code via hook.",
      "                                                        plataforma: codex | claude-code | antigravity.",
      "",
      "Nunca imprime valores de secretos."
    ].join("\n")
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const out = (line) => process.stdout.write(`${line}\n`);

  if (args.mode === "help") {
    printHelp(out);
    return;
  }

  const projectRoot = path.resolve(args.project);

  if (args.mode === "run") {
    runCommand(args.command, projectRoot, out);
    return;
  }

  if (args.mode === "setup") {
    setupPlatform(args.platform, projectRoot, out);
    return;
  }

  if (args.mode === "verify") {
    verifyAccess(args.platform, projectRoot, out);
    return;
  }

  const filePath = envLocalPath(projectRoot);

  if (!fs.existsSync(filePath)) {
    out(`No se encontro ${filePath}. Crea .env.local (copia de .env.example) y completalo.`);
    return;
  }

  const map = readEnvMap(projectRoot);
  const ignoreStatus = gitIgnoreStatus(projectRoot);

  if (args.mode === "status") {
    reportStatus(projectRoot, map, ignoreStatus, out);
    return;
  }

  // claude-env-file mode (Claude Code SessionStart hook)
  const envFile = process.env.CLAUDE_ENV_FILE;
  if (!envFile) {
    out("CLAUDE_ENV_FILE no esta definido; nada que cargar (se ejecuta dentro del hook de Claude Code).");
    return;
  }
  if (ignoreStatus === "not-ignored") {
    out("Carga abortada: .env.local NO esta ignorado por Git. Agregalo a .gitignore primero.");
    return;
  }

  const lines = [];
  for (const [name, value] of map.entries()) {
    if (value === "") {
      continue;
    }
    lines.push(`export ${name}=${posixSingleQuote(value)}`);
  }
  if (lines.length > 0) {
    fs.appendFileSync(envFile, `${lines.join("\n")}\n`);
  }
  out(`Cargadas ${lines.length} variables del TechStack en la sesion (valores no mostrados).`);
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main();
}
