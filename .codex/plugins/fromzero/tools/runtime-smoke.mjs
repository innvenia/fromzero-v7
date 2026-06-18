#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const adapters = ["codex", "claude-code", "antigravity"];
const codexHookEvents = new Set([
  "PreToolUse",
  "PermissionRequest",
  "PostToolUse",
  "PreCompact",
  "PostCompact",
  "UserPromptSubmit",
  "SubagentStart",
  "SubagentStop",
  "SessionStart",
  "Stop"
]);

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    json: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      args.root = argv[++index];
    } else if (arg === "--json") {
      args.json = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function commandResult(command, args) {
  const resolved = resolveCommand(command, args);
  const result = spawnSync(resolved.command, resolved.args, {
    encoding: "utf8",
    shell: false
  });
  return {
    command: [command, ...args].join(" "),
    available: result.status === 0,
    status: result.status,
    output: (result.stdout || result.stderr || "").trim()
  };
}

function resolveCommand(command, args) {
  if (process.platform !== "win32") {
    return { command, args };
  }

  const source = spawnSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `(Get-Command ${command} -ErrorAction SilentlyContinue).Source`
  ], {
    encoding: "utf8",
    shell: false
  }).stdout.trim();

  if (source.toLowerCase().endsWith(".ps1")) {
    return {
      command: "powershell.exe",
      args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", source, ...args]
    };
  }

  if (source) {
    return { command: source, args };
  }

  return { command, args };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function checkCodex(root) {
  const manifestPath = path.join(root, "adapters", "codex", ".codex-plugin", "plugin.json");
  const hooksPath = path.join(root, "adapters", "codex", "hooks", "hooks.json");
  const manifest = readJson(manifestPath);
  const hooks = readJson(hooksPath);
  const events = Object.keys(hooks.hooks ?? {});
  const unknownEvents = events.filter((eventName) => !codexHookEvents.has(eventName));
  const codexVersion = commandResult("codex", ["--version"]);
  const codexPluginHelp = commandResult("codex", ["plugin", "--help"]);

  return {
    adapter: "codex",
    cliVersion: codexVersion.available ? firstLine(codexVersion.output) : "not available",
    pluginValidateCommand: codexPluginHelp.output.includes("validate") ? "available" : "not found",
    manifestHooksField: Object.hasOwn(manifest, "hooks") ? "declared" : "not declared",
    hooksFile: fs.existsSync(hooksPath) ? "packaged" : "missing",
    hooksEvents: events,
    hooksEventsValid: unknownEvents.length === 0,
    hookModeDefault: "manual/advisory until runtime trust review",
    agentsRuntime: "not verified as executable subagents; packaged as role references",
    specialistReviewModes: [
      "subagente real: not verified",
      "revisión secuencial: supported by operator workflow",
      "rol documental: packaged role references"
    ],
    rulesRuntime: "not verified as auto-loaded runtime rules"
  };
}

function checkClaude(root) {
  const hooksPath = path.join(root, "adapters", "claude-code", "hooks", "hooks.json");
  const claudeVersion = commandResult("claude", ["--version"]);
  const claudeHelp = commandResult("claude", ["--help"]);
  return {
    adapter: "claude-code",
    cliVersion: claudeVersion.available ? firstLine(claudeVersion.output) : "not available",
    pluginDirFlag: claudeHelp.output.includes("--plugin-dir") ? "available" : "not found",
    hookEventsOutputFlag: claudeHelp.output.includes("--include-hook-events") ? "available" : "not found",
    hooksFile: fs.existsSync(hooksPath) ? "packaged" : "missing",
    hookModeDefault: "advisory until trust review",
    agentsRuntime: "plugin-dir supports plugin loading; executable agent behavior still requires runtime smoke",
    specialistReviewModes: [
      "subagente real: requires runtime smoke evidence",
      "revisión secuencial: supported by operator workflow",
      "rol documental: packaged role references"
    ],
    rulesRuntime: "not verified as auto-loaded runtime rules"
  };
}

function checkAntigravity(root) {
  return {
    adapter: "antigravity",
    pluginManifest: exists(root, "adapters/antigravity/plugin.json") ? "packaged" : "missing",
    hookModeDefault: "manual",
    agentsRuntime: "materialized as .agent workflows by init-project; runtime execution depends on Antigravity project support",
    specialistReviewModes: [
      "subagente real: depends on Antigravity project support",
      "revisión secuencial: supported by operator workflow",
      "rol documental: materialized .agent references"
    ],
    rulesRuntime: "materialized as .agent/rules by init-project"
  };
}

function firstLine(value) {
  return value.split(/\r?\n/).find(Boolean) ?? "";
}

function run(root) {
  return {
    checkedAt: new Date().toISOString(),
    root,
    adapters: [
      checkCodex(root),
      checkClaude(root),
      checkAntigravity(root)
    ]
  };
}

function printText(result) {
  console.log(`runtime-smoke: ${result.checkedAt}`);
  for (const item of result.adapters) {
    console.log(`\n[${item.adapter}]`);
    for (const [key, value] of Object.entries(item)) {
      if (key === "adapter") {
        continue;
      }
      const rendered = Array.isArray(value) ? value.join(", ") : value;
      console.log(`${key}: ${rendered}`);
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);
  const result = run(root);
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  printText(result);
}

main();
