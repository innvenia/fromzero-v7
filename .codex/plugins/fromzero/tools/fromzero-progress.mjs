#!/usr/bin/env node
// Informe de avance del proyecto para la metodología FromZero.
//
// Calcula el % de avance por Sprints de forma determinista: total desde
// artifacts/FROMZERO_PLAN.md (encabezados "### Sprint N") y completados desde
// artifacts/FROMZERO_STATE.md ("## 4. Último Sprint completado" -> "- Sprint:").
// La ejecución de Sprints es secuencial, así que "último completado = N" implica
// N Sprints hechos. No maneja secretos ni .env.
//
// Uso:
//   node tools/fromzero-progress.mjs [--project <ruta>] [--json]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = { project: process.env.CLAUDE_PROJECT_DIR || process.cwd(), json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--project") {
      args.project = argv[++i];
    } else if (a === "--json") {
      args.json = true;
    } else if (a === "--help" || a === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
}

// Slice from a "## heading" to just before the next "## " heading (mirrors check-artifacts).
function sectionContent(content, heading) {
  const start = content.indexOf(heading);
  if (start === -1) {
    return "";
  }
  const rest = content.slice(start + heading.length);
  const next = rest.search(/\n##\s+/);
  return next === -1 ? rest : rest.slice(0, next);
}

// First integer on the line that starts with `label` (e.g. "- Sprint:"), within a section.
function intOnLabel(section, label) {
  const wanted = label.toLowerCase();
  for (const line of section.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith(wanted)) {
      const m = trimmed.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : null;
    }
  }
  return null;
}

function computeProgress(plan, state) {
  const warnings = [];
  const total = (plan.match(/^### Sprint \d+\b/gm) || []).length;

  let completados = 0;
  let actual = null;
  let siguiente = null;
  if (state) {
    completados = intOnLabel(sectionContent(state, "## 4. Último Sprint completado"), "- Sprint:") ?? 0;
    actual = intOnLabel(sectionContent(state, "## 3. Sprint actual"), "- Sprint actual:");
    siguiente = intOnLabel(sectionContent(state, "## 5. Siguiente Sprint"), "- Sprint:");
  } else {
    warnings.push("sin artifacts/FROMZERO_STATE.md: completados=0 (avance no confirmado)");
  }

  // Cross-check against PLAN sprints explicitly marked completed (single-value lines only).
  const planCompleted = (plan.match(/^Estado:\s*completado\s*$/gim) || []).length;
  if (state && planCompleted > 0 && planCompleted !== completados) {
    warnings.push(`discrepancia: STATE último completado=${completados}, PLAN Estado:completado=${planCompleted}`);
  }

  const pendientes = total > 0 ? Math.max(0, total - completados) : 0;
  const pct = total > 0 ? Math.round((completados / total) * 100) : null;
  return { total, completados, pendientes, pct, actual, siguiente, warnings };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const out = (line) => process.stdout.write(`${line}\n`);
  if (args.help) {
    out("fromzero-progress.mjs — % de avance del proyecto por Sprints.");
    out("Uso: node tools/fromzero-progress.mjs [--project <ruta>] [--json]");
    return;
  }

  const project = path.resolve(args.project);
  const plan = readIfExists(path.join(project, "artifacts", "FROMZERO_PLAN.md"));
  const state = readIfExists(path.join(project, "artifacts", "FROMZERO_STATE.md"));

  if (!plan) {
    if (args.json) {
      out(JSON.stringify({ error: "no-plan" }));
    } else {
      out("Avance: sin artifacts/FROMZERO_PLAN.md; no se puede calcular.");
    }
    return;
  }

  const p = computeProgress(plan, state);

  if (args.json) {
    out(JSON.stringify(p, null, 2));
    return;
  }

  if (p.total === 0) {
    out("Avance: el plan no tiene Sprints numerados (### Sprint N); no se puede calcular.");
    return;
  }

  out(`Avance: ${p.completados}/${p.total} Sprints completados (${p.pct}%)`);
  out(`Pendientes: ${p.pendientes}`);
  out(`Sprint actual: ${p.actual ?? "no registrado"}`);
  out(`Siguiente Sprint: ${p.siguiente ?? "no registrado"}`);
  for (const w of p.warnings) {
    out(`Aviso: ${w}`);
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main();
}

export { computeProgress, sectionContent, intOnLabel };
