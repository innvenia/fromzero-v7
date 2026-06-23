#!/usr/bin/env node
// Resolución determinista del entorno de base de datos para la metodología FromZero.
//
// Propósito: antes de ejecutar migraciones o verificaciones de BD, decidir si el objetivo
// es local (CLI `--local`) o cloud (`--db-url` con la conexión directa) leyendo la config
// del proyecto, en vez de asumir `--local` por defecto. Reporta solo presencia de variables
// y la localidad del host público; nunca imprime valores de secretos ni la URL completa
// (cumple Controlled Secret Runtime Access).
//
// Uso:
//   node tools/resolve-db-environment.mjs [--project <ruta>] [--require <local|cloud>]
//     Sin --require: imprime el entorno detectado y la forma de comando recomendada (exit 0).
//     Con --require: exit 1 si el entorno detectado no coincide con el exigido.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "./load-env-local.mjs";

function parseArgs(argv) {
  const args = { project: process.env.CLAUDE_PROJECT_DIR || process.cwd(), require: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--project") {
      args.project = argv[++index];
    } else if (arg === "--require") {
      args.require = String(argv[++index] || "").toLowerCase();
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

// A public Supabase URL pointing at loopback or the default CLI ports is a local stack.
function urlIsLocal(url) {
  if (!url) {
    return false;
  }
  return /localhost|127\.0\.0\.1|0\.0\.0\.0|:5432[12]/.test(url);
}

// Classify purely from declared config. Presence-based to avoid leaking secret values; the
// only raw value inspected is the public NEXT_PUBLIC_SUPABASE_URL, and only its locality is
// emitted, never the URL itself.
function detectTarget(present, publicUrl) {
  const hasDirect = present.SUPABASE_DIRECT_CONNECTION_STRING === true;
  const hasProjectId = present.SUPABASE_PROJECT_ID === true;
  const hasUrl = present.NEXT_PUBLIC_SUPABASE_URL === true;

  if (hasUrl && urlIsLocal(publicUrl)) {
    return "local";
  }
  if (hasDirect || hasProjectId || (hasUrl && !urlIsLocal(publicUrl))) {
    return "cloud";
  }
  return "indeterminado";
}

function recommendedCommand(target, present) {
  if (target === "local") {
    return 'supabase migration up --local   (stack local; requiere "supabase start")';
  }
  if (target === "cloud") {
    if (present.SUPABASE_ACCESS_TOKEN === true) {
      return 'supabase db push --linked   o   supabase db push --db-url "$SUPABASE_DIRECT_CONNECTION_STRING"';
    }
    return 'supabase db push --db-url "$SUPABASE_DIRECT_CONNECTION_STRING"   (sin SUPABASE_ACCESS_TOKEN, --linked no aplica)';
  }
  return "sin señales de BD en .env.local; declara el entorno objetivo o completa .env.local";
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const out = (line) => process.stdout.write(`${line}\n`);
  if (args.help) {
    out("resolve-db-environment.mjs — detecta entorno BD (local|cloud) desde la config del proyecto.");
    out("Uso: node tools/resolve-db-environment.mjs [--project <ruta>] [--require <local|cloud>]");
    return;
  }

  const projectRoot = path.resolve(args.project);
  // Load values into this short-lived process only (never persisted globally, never printed).
  const env = loadEnvLocal({ project: projectRoot, mutateProcessEnv: true });
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const target = detectTarget(env.present, publicUrl);

  out(`Entorno BD detectado: ${target}`);
  out("Señales (solo presencia, sin valores):");
  for (const name of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_DIRECT_CONNECTION_STRING",
    "SUPABASE_PROJECT_ID",
    "SUPABASE_ACCESS_TOKEN"
  ]) {
    out(`  ${name}_set: ${env.present[name] === true}`);
  }
  if (env.present.NEXT_PUBLIC_SUPABASE_URL === true) {
    out(`  NEXT_PUBLIC_SUPABASE_URL_host: ${urlIsLocal(publicUrl) ? "local" : "remoto"}`);
  }
  out(`Comando recomendado: ${recommendedCommand(target, env.present)}`);
  out("No asumas --local por defecto: confirma que el objetivo coincide con el entorno declarado en State/Plan.");

  if (args.require) {
    if (args.require !== "local" && args.require !== "cloud") {
      process.stderr.write('--require admite solo "local" o "cloud".\n');
      process.exitCode = 2;
      return;
    }
    if (target !== args.require) {
      process.stderr.write(`Mismatch: exigido ${args.require}, detectado ${target}.\n`);
      process.exitCode = 1;
    }
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main();
}

export { detectTarget, urlIsLocal, recommendedCommand };
