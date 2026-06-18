#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = parseArgs(process.argv.slice(2));
const adapterRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(args.project || process.cwd());
const shouldInstall = Boolean(args.install);

const DEFAULT_DOCS_PATHS = ["docs", "documentation"];
const ARTIFACTS_DIR = "artifacts";
const PRIORITY_DOC_FILES = [
  "PRD.md",
  "REFERENCE_MODULES.md",
  "REFERENCE_DATABASE_SCHEMA.md",
  "REFERENCE_ARCHITECTURE.md",
  "REFERENCE_STRUCTURE.md",
  "REFERENCE_STACK.md",
  "SECURITY_ASSURANCE.md",
  "SCALABILITY_ASSURANCE.md",
  "DEPENDENCY_MATRIX.md",
  "BOOTSTRAP_REFERENCE.md"
];
const ROOT_SCAN_FILES = [
  "PRD.md",
  "README.md",
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "app.json",
  "app.config.js",
  "app.config.ts",
  "next.config.js",
  "next.config.ts",
  "vercel.json",
  "render.yaml",
  "docker-compose.yml",
  "Dockerfile"
];
const FROMZERO_ARTIFACTS = [
  "FROMZERO_CONTEXT.md",
  "FROMZERO_QUESTIONNAIRE.md",
  "FROMZERO_SPEC.md",
  "FROMZERO_PLAN.md",
  "FROMZERO_STATE.md"
];
const RECURSIVE_EXTENSIONS = new Set([".md", ".mdx", ".txt", ".json", ".yaml", ".yml", ".toml"]);
const EXCLUDED_DIRS = new Set([".git", "node_modules", ".next", "dist", "build", "coverage", ".cache"]);
const MAX_SCAN_FILES = 100;
const MAX_TOTAL_BYTES = 2 * 1024 * 1024;
const MAX_FILE_BYTES = 256 * 1024;

const libraryRoot = path.join(adapterRoot, "library");
assertPackagedLibrary(libraryRoot);
const manifest = readJson(path.join(libraryRoot, "manifest.json"));
const categories = readJson(path.join(libraryRoot, "categories.json"));
const registry = readJson(path.join(libraryRoot, "registry-index.json"));

const projectScan = collectProjectText(projectRoot, args.query || "", args.docsPaths);
const detected = detectResources(projectScan.text, manifest, categories, registry);
const lock = buildLock(detected);

if (shouldInstall) {
  installResources(projectRoot, adapterRoot, detected, lock, { force: args.force });
}

process.stdout.write(JSON.stringify({
  projectRoot,
  adapter: manifest.adapter,
  installed: shouldInstall,
  selectedResources: detected.selected.map((item) => item.id),
  categoryFallbacks: detected.categoryFallbacks,
  registryCandidates: detected.registryCandidates,
  missing: detected.missing,
  requiredEnvExample: uniq(detected.selected.flatMap((item) => item.requiredEnvExample || [])),
  secretEnv: uniq(detected.selected.flatMap((item) => item.secretEnv || [])),
  gates: uniq(detected.selected.flatMap((item) => item.requiredGates || [])),
  scannedFiles: projectScan.scannedFiles,
  skippedFiles: projectScan.skippedFiles,
  lockPath: shouldInstall ? path.join(projectRoot, ".fromzero", "fromzero.lock.json") : null
}, null, 2));
process.stdout.write("\n");

function parseArgs(argv) {
  const result = {
    docsPaths: [],
    force: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--install") {
      result.install = true;
    } else if (arg === "--force") {
      result.force = true;
    } else if (arg === "--project") {
      result.project = argv[index + 1];
      index += 1;
    } else if (arg === "--query") {
      result.query = argv[index + 1];
      index += 1;
    } else if (arg === "--docs") {
      result.docsPaths.push(argv[index + 1]);
      index += 1;
    } else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

function printHelp() {
  process.stdout.write(`FromZero resource resolver

Usage:
  node tools/resource-resolver.mjs --project <path>
  node tools/resource-resolver.mjs --project <path> --docs docs --docs documentation
  node tools/resource-resolver.mjs --project <path> --install
  node tools/resource-resolver.mjs --project <path> --install --force
  node tools/resource-resolver.mjs --query "expo stripe postgres" --install

Security:
  - Does not read .env files.
  - Does not connect external services.
  - Does not download remote packs.
  - Copies only selected resource notes and lockfile into .fromzero/.
  - Keeps ui-template-reference inside the plugin library.
  - Does not overwrite changed installed resources unless --force is used.
`);
}

function assertPackagedLibrary(root) {
  const requiredFiles = ["manifest.json", "categories.json", "registry-index.json"];
  const missing = requiredFiles.filter((fileName) => !fs.existsSync(path.join(root, fileName)));
  if (missing.length === 0) {
    return;
  }

  console.error([
    "FromZero packaged library is missing for this tool root.",
    `Missing files under ${root}: ${missing.join(", ")}.`,
    "Run resource-resolver.mjs from an adapter package, for example adapters/codex/tools, adapters/claude-code/tools, or adapters/antigravity/tools.",
    "core/tools contains shared source tooling and is not a complete runtime package."
  ].join(" "));
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function collectProjectText(root, query, docsPaths = []) {
  const chunks = [query];
  const state = {
    scannedFiles: [],
    skippedFiles: [],
    totalBytes: 0,
    seenFiles: new Set()
  };

  for (const name of ROOT_SCAN_FILES) {
    addFile(root, path.join(root, name), chunks, state, { allowAnyName: true });
  }

  for (const name of FROMZERO_ARTIFACTS) {
    addFile(root, path.join(root, ARTIFACTS_DIR, name), chunks, state);
  }
  addPath(root, path.join(root, ARTIFACTS_DIR), chunks, state);

  addFile(root, path.join(root, ".fromzero", "fromzero.lock.json"), chunks, state);
  addPath(root, path.join(root, ".fromzero", "resources"), chunks, state);

  const requestedDocsPaths = docsPaths.length > 0 ? docsPaths : DEFAULT_DOCS_PATHS;
  for (const docsPath of requestedDocsPaths) {
    const resolved = resolveProjectPath(root, docsPath);
    if (!resolved) {
      state.skippedFiles.push({ path: String(docsPath), reason: "outside project root" });
      continue;
    }
    for (const priorityFile of PRIORITY_DOC_FILES) {
      addFile(root, path.join(resolved, priorityFile), chunks, state);
    }
    addPath(root, resolved, chunks, state);
  }

  return {
    text: chunks.join("\n").toLowerCase(),
    scannedFiles: state.scannedFiles,
    skippedFiles: state.skippedFiles
  };
}

function addPath(root, absolutePath, chunks, state) {
  if (!fs.existsSync(absolutePath)) {
    return;
  }

  const stats = safeStat(absolutePath);
  if (!stats) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "stat failed" });
    return;
  }

  if (stats.isFile()) {
    addFile(root, absolutePath, chunks, state);
    return;
  }

  if (!stats.isDirectory()) {
    return;
  }

  for (const filePath of listProjectFiles(root, absolutePath, state)) {
    addFile(root, filePath, chunks, state);
  }
}

function listProjectFiles(root, absoluteRoot, state) {
  const files = [];
  const stack = [absoluteRoot];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = safeReadDir(current);
    if (!entries) {
      state.skippedFiles.push({ path: relativeProjectPath(root, current), reason: "read failed" });
      continue;
    }

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name) || isEnvFileName(entry.name)) {
          state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "excluded directory" });
          continue;
        }
        stack.push(absolutePath);
      } else if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function addFile(root, absolutePath, chunks, state, options = {}) {
  const normalizedPath = path.resolve(absolutePath);
  if (state.seenFiles?.has(normalizedPath)) {
    return;
  }

  if (state.scannedFiles.length >= MAX_SCAN_FILES) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "file limit reached" });
    return;
  }

  if (!isInside(root, absolutePath)) {
    state.skippedFiles.push({ path: absolutePath, reason: "outside project root" });
    return;
  }

  const fileName = path.basename(absolutePath);
  if (isEnvFileName(fileName)) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "env file excluded" });
    return;
  }

  if (!options.allowAnyName && !RECURSIVE_EXTENSIONS.has(path.extname(absolutePath).toLowerCase())) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "unsupported extension" });
    return;
  }

  const stats = safeStat(absolutePath);
  if (!stats || !stats.isFile()) {
    return;
  }

  state.seenFiles?.add(normalizedPath);

  if (state.totalBytes >= MAX_TOTAL_BYTES) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "total size limit reached" });
    return;
  }

  const remainingBytes = Math.max(0, MAX_TOTAL_BYTES - state.totalBytes);
  const bytesToRead = Math.min(stats.size, MAX_FILE_BYTES, remainingBytes);
  if (bytesToRead === 0) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "total size limit reached" });
    return;
  }

  chunks.push(readFilePrefix(absolutePath, bytesToRead));
  state.totalBytes += bytesToRead;
  state.scannedFiles.push(relativeProjectPath(root, absolutePath));

  if (stats.size > bytesToRead) {
    state.skippedFiles.push({ path: relativeProjectPath(root, absolutePath), reason: "truncated" });
  }
}

function readFilePrefix(filePath, bytesToRead) {
  const buffer = Buffer.alloc(bytesToRead);
  const fd = fs.openSync(filePath, "r");
  try {
    const bytesRead = fs.readSync(fd, buffer, 0, bytesToRead, 0);
    return buffer.subarray(0, bytesRead).toString("utf8");
  } finally {
    fs.closeSync(fd);
  }
}

function resolveProjectPath(root, requestedPath) {
  if (!requestedPath) {
    return null;
  }
  const resolved = path.resolve(path.isAbsolute(requestedPath) ? requestedPath : path.join(root, requestedPath));
  return isInside(root, resolved) ? resolved : null;
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function relativeProjectPath(root, absolutePath) {
  return path.relative(root, absolutePath).replaceAll("\\", "/");
}

function isEnvFileName(fileName) {
  return fileName.startsWith(".env");
}

function safeStat(absolutePath) {
  try {
    return fs.statSync(absolutePath);
  } catch {
    return null;
  }
}

function safeReadDir(absolutePath) {
  try {
    return fs.readdirSync(absolutePath, { withFileTypes: true });
  } catch {
    return null;
  }
}

function detectResources(text, manifestData, categoryData, registryData) {
  const selected = [];
  const selectedIds = new Set();
  const categoryFallbacks = [];
  const registryCandidates = [];

  for (const resource of manifestData.resources) {
    if (resource.required || matches(text, resource.triggers)) {
      addSelected(resource, selected, selectedIds);
    }
  }

  for (const category of categoryData.categories) {
    if (matches(text, category.commonTechnologies)) {
      const resource = manifestData.resources.find((item) => item.id === category.packagedResource);
      if (resource) {
        addSelected(resource, selected, selectedIds);
        categoryFallbacks.push({
          category: category.id,
          packagedResource: category.packagedResource
        });
      } else {
        addMissingFallback(manifestData, selected, selectedIds);
      }
    }
  }

  for (const pack of registryData.packs) {
    if (matches(text, pack.technologies)) {
      registryCandidates.push(pack);
      const category = categoryData.categories.find((item) => item.id === pack.category);
      const categoryCovered = category ? selectedIds.has(category.packagedResource) : false;
      const exactPackaged = selected.some((item) => matches(pack.technologies.join(" ").toLowerCase(), item.triggers || []));
      if (!categoryCovered && !exactPackaged) {
        addMissingFallback(manifestData, selected, selectedIds);
      }
    }
  }

  return {
    selected,
    categoryFallbacks,
    registryCandidates,
    missing: registryCandidates.filter((pack) => {
      const category = categoryData.categories.find((item) => item.id === pack.category);
      const categoryCovered = category ? selectedIds.has(category.packagedResource) : false;
      const exactPackaged = selected.some((item) => matches(pack.technologies.join(" ").toLowerCase(), item.triggers || []));
      return !categoryCovered && !exactPackaged;
    }).map((pack) => ({
      packId: pack.id,
      category: pack.category,
      status: pack.status,
      source: pack.source
    }))
  };
}

function addSelected(resource, selected, selectedIds) {
  if (!selectedIds.has(resource.id)) {
    selected.push(resource);
    selectedIds.add(resource.id);
  }
}

function addMissingFallback(manifestData, selected, selectedIds) {
  const fallback = manifestData.resources.find((item) => item.id === "missing-resource-resolution");
  if (fallback) {
    addSelected(fallback, selected, selectedIds);
  }
}

function matches(text, triggers = []) {
  return triggers.some((trigger) => matchesTrigger(text, trigger));
}

function matchesTrigger(text, trigger) {
  const normalized = String(trigger).trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const escaped = escapeRegExp(normalized).replace(/\s+/g, "\\s+");
  const prefix = /^[a-z0-9]/.test(normalized) ? "(^|[^a-z0-9])" : "";
  const suffix = /[a-z0-9]$/.test(normalized) ? "(?=$|[^a-z0-9])" : "";
  return new RegExp(`${prefix}${escaped}${suffix}`, "i").test(text);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildLock(detected) {
  return {
    lockVersion: "0.1.0",
    generatedAt: new Date().toISOString(),
    selectedResources: detected.selected.map((item) => ({
      id: item.id,
      type: item.type,
      packagedPath: item.packagedPath,
      requiredEnvExample: item.requiredEnvExample || [],
      secretEnv: item.secretEnv || [],
      requiredGates: item.requiredGates || []
    })),
    registryCandidates: detected.registryCandidates.map((item) => ({
      id: item.id,
      category: item.category,
      technologies: item.technologies,
      status: item.status,
      source: item.source
    }))
  };
}

function installResources(root, sourceRoot, detected, lockData, options = {}) {
  const targetRoot = path.join(root, ".fromzero");
  const resourcesTarget = path.join(targetRoot, "resources");
  fs.mkdirSync(resourcesTarget, { recursive: true });

  for (const resource of detected.selected) {
    const sourcePath = path.join(sourceRoot, resource.packagedPath);
    if (fs.existsSync(sourcePath)) {
      copyManagedFile(sourcePath, path.join(resourcesTarget, `${resource.id}.md`), options);
    }
  }

  fs.writeFileSync(path.join(targetRoot, "fromzero.lock.json"), JSON.stringify(lockData, null, 2));
}

function copyManagedFile(source, target, options = {}) {
  if (fs.existsSync(target) && !options.force && !filesEqual(source, target)) {
    throw new Error(`Refusing to overwrite modified resource: ${target}. Re-run with --force after reviewing it.`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function filesEqual(left, right) {
  return fs.readFileSync(left).equals(fs.readFileSync(right));
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}
