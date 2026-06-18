#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adapterRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] || "--session-start";

function readEvidence() {
  const evidenceJson = path.join(adapterRoot, "hooks", "evidence.json");
  const rulesEvidence = path.join(adapterRoot, "rules", "evidence.md");

  if (fs.existsSync(evidenceJson)) {
    return JSON.parse(fs.readFileSync(evidenceJson, "utf8")).requiredEvidence ?? [];
  }
  if (fs.existsSync(rulesEvidence)) {
    return fs.readFileSync(rulesEvidence, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  }
  return [];
}

// Mirror init-project.mjs detection: identify the runtime adapter from packaged markers.
function detectAdapter() {
  if (fs.existsSync(path.join(adapterRoot, ".codex-plugin", "plugin.json"))) {
    return "codex";
  }
  if (fs.existsSync(path.join(adapterRoot, ".claude-plugin", "plugin.json"))) {
    return "claude-code";
  }
  if (fs.existsSync(path.join(adapterRoot, "GEMINI.md"))) {
    return "antigravity";
  }
  return "unknown";
}

function readStopPayload() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function printPlainReminder(evidence) {
  process.stdout.write("[FromZero] Antes de cerrar, verifica la evidencia requerida:\n");
  for (const item of evidence) {
    process.stdout.write(`- ${item}\n`);
  }
}

if (mode === "--session-start") {
  process.stdout.write(
    "[FromZero] Usa fz-context antes de trabajar. Lee library/manifest.json. Las verificaciones de seguridad y escalabilidad son obligatorias. El estado vive en artifacts/FROMZERO_STATE.md.\n"
  );
} else if (mode === "--stop") {
  const evidence = readEvidence();

  // Claude Code is the only runtime whose Stop hook can feed the model: plain stdout is
  // shown only in transcript, so emit the official block JSON instead. The block fires
  // once (stop_hook_active guards against loops) and only inside an active FromZero
  // project (artifacts/FROMZERO_STATE.md present). Other runtimes keep the plain reminder, which
  // avoids relying on hook-output contracts they may not share.
  if (detectAdapter() === "claude-code") {
    const payload = readStopPayload();
    const projectRoot = payload.cwd || process.cwd();
    const inFromZeroProject = fs.existsSync(path.join(projectRoot, "artifacts", "FROMZERO_STATE.md"));

    if (!payload.stop_hook_active && evidence.length > 0 && inFromZeroProject) {
      const reason = [
        "[FromZero] Antes de cerrar, verifica y reporta la evidencia requerida (marca N/A la que no aplique a este Sprint):",
        ...evidence.map((item) => `- ${item}`)
      ].join("\n");
      process.stdout.write(JSON.stringify({ decision: "block", reason }) + "\n");
    }
  } else {
    printPlainReminder(evidence);
  }
} else {
  process.stderr.write(`Unknown mode: ${mode}\n`);
  process.exit(1);
}
