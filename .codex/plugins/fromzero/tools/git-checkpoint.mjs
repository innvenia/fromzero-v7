#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    project: process.cwd(),
    allow: [],
    message: "",
    commit: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--project") {
      args.project = argv[++index];
    } else if (arg === "--allow") {
      args.allow.push(normalizePath(argv[++index]));
    } else if (arg === "--message") {
      args.message = argv[++index];
    } else if (arg === "--commit") {
      args.commit = true;
    } else if (arg === "--dry-run") {
      args.commit = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function normalizePath(value) {
  return String(value).replaceAll("\\", "/").replace(/^\.\//, "");
}

function runGit(gitRoot, args) {
  const result = spawnSync("git", args, {
    cwd: gitRoot,
    encoding: "utf8",
    shell: false
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args.join(" ")} failed`).trim());
  }
  return result.stdout;
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

function statusEntries(gitRoot) {
  const output = runGit(gitRoot, ["status", "--porcelain=v1"]);
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => ({
      code: line.slice(0, 2),
      path: normalizePath(line.slice(3).replace(/^"|"$/g, ""))
    }));
}

function isSensitive(relativePath) {
  const lower = relativePath.toLowerCase();
  return (
    lower === ".env" ||
    lower.startsWith(".env.") ||
    lower.endsWith(".env") ||
    lower.includes("/.env") ||
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.endsWith(".key")
  );
}

function isFromZeroArtifact(relativePath) {
  return (
    relativePath.startsWith("artifacts/") ||
    relativePath === ".fromzero/fromzero.lock.json"
  );
}

function classify(entries, allow) {
  const allowed = new Set(allow);
  return entries.map((entry) => {
    const sensitive = isSensitive(entry.path);
    const explicitlyAllowed = allowed.has(entry.path);
    const fromZeroArtifact = isFromZeroArtifact(entry.path);
    const allowedForCommit = explicitlyAllowed && !sensitive;
    return {
      ...entry,
      class: sensitive ? "sensitive" : fromZeroArtifact ? "fromzero-artifact" : "external",
      allowedForCommit
    };
  });
}

function printClassification(items) {
  if (items.length === 0) {
    console.log("checkpoint: working tree limpio");
    return;
  }

  console.log("checkpoint: clasificación de cambios");
  for (const item of items) {
    const marker = item.allowedForCommit ? "permitido" : "no permitido";
    console.log(`- ${item.code.trim() || "modified"} ${item.path} [${item.class}; ${marker}]`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = path.resolve(args.project);
  const gitRoot = findGitRoot(projectRoot);
  if (!gitRoot) {
    throw new Error("checkpoint: Git no detectado");
  }

  const entries = statusEntries(gitRoot);
  const classified = classify(entries, args.allow);
  printClassification(classified);

  const blocked = classified.filter((item) => !item.allowedForCommit);
  if (args.commit && blocked.length > 0) {
    console.error("checkpoint: commit bloqueado; hay cambios fuera del allowlist o sensibles");
    process.exit(1);
  }

  if (!args.commit) {
    return;
  }

  if (!args.message.trim()) {
    throw new Error("checkpoint: --message es obligatorio con --commit");
  }
  if (args.allow.length === 0) {
    throw new Error("checkpoint: --allow es obligatorio con --commit");
  }

  const allowedChanged = classified.filter((item) => item.allowedForCommit).map((item) => item.path);
  if (allowedChanged.length === 0) {
    console.log("checkpoint: no hay cambios permitidos para commitear");
    return;
  }

  runGit(gitRoot, ["add", "--", ...allowedChanged]);
  runGit(gitRoot, ["commit", "-m", args.message]);
  const hash = runGit(gitRoot, ["rev-parse", "--short", "HEAD"]).trim();
  console.log(`checkpoint: commit creado ${hash} - ${args.message}`);
}

main();
