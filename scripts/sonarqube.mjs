#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_METRICS = [
  "alert_status",
  "bugs",
  "vulnerabilities",
  "security_hotspots",
  "code_smells",
  "coverage",
  "duplicated_lines_density",
  "ncloc",
  "reliability_rating",
  "security_rating",
  "sqale_rating",
  "security_hotspots_reviewed"
];

const ADMIN_MCP_TOOLS = [
  "create_project",
  "delete_project",
  "update_project",
  "create_quality_gate",
  "update_quality_gate",
  "delete_quality_gate",
  "assign_quality_gate",
  "create_quality_profile",
  "update_quality_profile",
  "delete_quality_profile"
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function parseDotEnv(content) {
  const entries = new Map();
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    if (line.startsWith("export ")) {
      line = line.slice(7).trim();
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const name = line.slice(0, separatorIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    } else {
      const commentIndex = value.indexOf(" #");
      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    entries.set(name, value);
  }

  return entries;
}

export function applySonarAliases(envMap) {
  const aliasPairs = [
    ["SONARQUBE_URL", "SONAR_HOST_URL"],
    ["SONARQUBE_TOKEN", "SONAR_TOKEN"],
    ["SONARQUBE_PROJECT_KEY", "SONAR_PROJECT_KEY"]
  ];

  for (const [canonicalName, legacyName] of aliasPairs) {
    const canonicalValue = envMap.get(canonicalName);
    const legacyValue = envMap.get(legacyName);
    if (canonicalValue && !legacyValue) {
      envMap.set(legacyName, canonicalValue);
    } else if (legacyValue && !canonicalValue) {
      envMap.set(canonicalName, legacyValue);
    }
  }

  return envMap;
}

export function loadSonarEnv({ cwd = process.cwd(), env = process.env } = {}) {
  const envMap = new Map();
  const envFilePath = path.join(cwd, ".env.local");

  if (fs.existsSync(envFilePath)) {
    for (const [name, value] of parseDotEnv(fs.readFileSync(envFilePath, "utf8"))) {
      envMap.set(name, value);
    }
  }

  for (const name of [
    "SONARQUBE_URL",
    "SONARQUBE_TOKEN",
    "SONARQUBE_PROJECT_KEY",
    "SONAR_HOST_URL",
    "SONAR_TOKEN",
    "SONAR_PROJECT_KEY"
  ]) {
    if (env[name] !== undefined && env[name] !== "") {
      envMap.set(name, env[name]);
    }
  }

  applySonarAliases(envMap);

  return {
    url: envMap.get("SONARQUBE_URL") || "",
    token: envMap.get("SONARQUBE_TOKEN") || "",
    projectKey: envMap.get("SONARQUBE_PROJECT_KEY") || "",
    names: [...envMap.keys()].sort()
  };
}

export function mapMeasures(measuresResponse) {
  const measures = {};
  for (const measure of measuresResponse?.component?.measures ?? []) {
    measures[measure.metric] = measure.value;
  }
  return measures;
}

export function mapQualityGate(projectStatus) {
  const status = projectStatus?.projectStatus ?? projectStatus;
  return {
    status: status?.status ?? "UNKNOWN",
    ignoredConditions: Boolean(status?.ignoredConditions),
    conditions: (status?.conditions ?? []).map((condition) => ({
      metricKey: condition.metricKey,
      status: condition.status,
      comparator: condition.comparator,
      errorThreshold: condition.errorThreshold,
      actualValue: condition.actualValue
    }))
  };
}

export function mapIssues(issuesResponse) {
  return (issuesResponse?.issues ?? []).map((issue) => ({
    key: issue.key,
    severity: issue.severity,
    type: issue.type,
    status: issue.status,
    component: issue.component,
    line: issue.line ?? null,
    message: issue.message
  }));
}

function printUsage() {
  console.log(
    [
      "Uso: node scripts/sonarqube.mjs <doctor|status|issues|gate|scan|setup-mcp>",
      "",
      "Comandos:",
      "  doctor    Valida variables, acceso REST, proyecto y Docker.",
      "  status    Muestra Quality Gate, métricas, rama y último análisis.",
      "  issues    Lista issues abiertos por severidad/tipo.",
      "  gate      Falla si el Quality Gate no está en OK.",
      "  scan      Ejecuta coverage y SonarScanner CLI vía Docker.",
      "  setup-mcp Activa solo el MCP SonarQube local en .mcp.json."
    ].join("\n")
  );
}

function requireConfig(config) {
  const missing = [];
  if (!config.url) missing.push("SONARQUBE_URL");
  if (!config.token) missing.push("SONARQUBE_TOKEN");
  if (!config.projectKey) missing.push("SONARQUBE_PROJECT_KEY");
  if (missing.length > 0) {
    throw new Error(`Faltan variables requeridas: ${missing.join(", ")}`);
  }
}

function restClient(config) {
  const baseUrl = config.url.replace(/\/+$/, "");
  const headers = {
    Authorization: `Bearer ${config.token}`
  };

  return async function sonarGet(pathname, params = {}) {
    const url = new URL(`${baseUrl}${pathname}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`SonarQube API ${response.status} ${response.statusText}: ${pathname}`);
    }
    return response.json();
  };
}

async function fetchProjectSnapshot(config) {
  const get = restClient(config);
  const [projectSearch, qualityGate, branches, measures] = await Promise.all([
    get("/api/projects/search", { projects: config.projectKey }),
    get("/api/qualitygates/project_status", { projectKey: config.projectKey }),
    get("/api/project_branches/list", { project: config.projectKey }),
    get("/api/measures/component", {
      component: config.projectKey,
      metricKeys: DEFAULT_METRICS.join(",")
    })
  ]);

  const project = projectSearch.components?.[0] ?? null;
  const mainBranch = branches.branches?.find((branch) => branch.isMain) ?? branches.branches?.[0] ?? null;

  return {
    project,
    qualityGate: mapQualityGate(qualityGate),
    branches: branches.branches ?? [],
    mainBranch,
    measures: mapMeasures(measures)
  };
}

function printPresence(config) {
  console.log("Configuración SonarQube:");
  console.log(`  SONARQUBE_URL_set: ${Boolean(config.url)}`);
  console.log(`  SONARQUBE_TOKEN_set: ${Boolean(config.token)}`);
  console.log(`  SONARQUBE_PROJECT_KEY_set: ${Boolean(config.projectKey)}`);
}

function printSnapshot(snapshot) {
  if (!snapshot.project) {
    console.log("Proyecto: no encontrado");
    return;
  }

  console.log(`Proyecto: ${snapshot.project.key} (${snapshot.project.name})`);
  console.log(`Visibilidad: ${snapshot.project.visibility ?? "n/a"}`);
  console.log(`Último análisis: ${snapshot.project.lastAnalysisDate ?? "n/a"}`);
  console.log(`Revisión: ${snapshot.project.revision ?? "n/a"}`);
  console.log(`Rama principal: ${snapshot.mainBranch?.name ?? "n/a"}`);
  console.log(`Quality Gate: ${snapshot.qualityGate.status}`);
  console.log("");
  console.log("Métricas:");
  for (const metric of DEFAULT_METRICS) {
    if (snapshot.measures[metric] !== undefined) {
      console.log(`  ${metric}: ${snapshot.measures[metric]}`);
    }
  }
}

function dockerAvailable() {
  const command = spawnSync("docker", ["info", "--format", "{{.ServerVersion}}"], {
    encoding: "utf8"
  });
  return {
    ok: command.status === 0,
    message: command.status === 0 ? command.stdout.trim() : (command.stderr || command.stdout).trim()
  };
}

async function doctor(config) {
  printPresence(config);
  requireConfig(config);

  const get = restClient(config);
  const auth = await get("/api/authentication/validate");
  console.log(`Acceso API REST: ${auth.valid ? "OK" : "NO VÁLIDO"}`);
  if (!auth.valid) {
    process.exitCode = 1;
    return;
  }

  const snapshot = await fetchProjectSnapshot(config);
  console.log(`Proyecto encontrado: ${Boolean(snapshot.project)}`);
  console.log(`Quality Gate: ${snapshot.qualityGate.status}`);

  const docker = dockerAvailable();
  console.log(`Docker disponible: ${docker.ok}`);
  if (!docker.ok) {
    console.log("Docker detalle: no se pudo conectar al daemon. Inicia Docker Desktop antes de `sonar:scan` o MCP.");
  }
}

async function status(config) {
  requireConfig(config);
  printSnapshot(await fetchProjectSnapshot(config));
}

async function issues(config) {
  requireConfig(config);
  const get = restClient(config);
  const response = await get("/api/issues/search", {
    componentKeys: config.projectKey,
    resolved: "false",
    ps: "100",
    s: "SEVERITY",
    asc: "false"
  });
  const mappedIssues = mapIssues(response);

  console.log(`Issues abiertos: ${response.total ?? mappedIssues.length}`);
  for (const issue of mappedIssues) {
    const location = issue.line ? `${issue.component}:${issue.line}` : issue.component;
    console.log(`[${issue.severity}] ${issue.type} ${issue.key} ${location}`);
    console.log(`  ${issue.message}`);
  }
}

async function gate(config) {
  requireConfig(config);
  const snapshot = await fetchProjectSnapshot(config);
  console.log(`Quality Gate: ${snapshot.qualityGate.status}`);
  for (const condition of snapshot.qualityGate.conditions) {
    console.log(
      `  ${condition.status} ${condition.metricKey}: ${condition.actualValue} ${condition.comparator} ${condition.errorThreshold}`
    );
  }
  if (snapshot.qualityGate.status !== "OK") {
    process.exitCode = 1;
  }
}

function runChecked(command, args, options = {}) {
  let executable = command;
  let executableArgs = args;
  if (process.platform === "win32" && command === "npm") {
    const npmCliPath = process.env.npm_execpath;
    if (npmCliPath && fs.existsSync(npmCliPath)) {
      executable = process.execPath;
      executableArgs = [npmCliPath, ...args];
    } else {
      executable = process.env.ComSpec || "cmd.exe";
      executableArgs = ["/d", "/s", "/c", ["npm", ...args].join(" ")];
    }
  }

  const result = spawnSync(executable, executableArgs, {
    stdio: "inherit",
    shell: false,
    ...options
  });
  if (result.status !== 0) {
    const detail = result.error ? `: ${result.error.message}` : "";
    throw new Error(`${command} ${args.join(" ")} falló con código ${result.status}${detail}`);
  }
}

function scan(config, cwd) {
  requireConfig(config);
  runChecked("npm", ["run", "test:coverage"], { cwd });

  const docker = dockerAvailable();
  if (!docker.ok) {
    throw new Error("Docker no está disponible. Inicia Docker Desktop antes de ejecutar sonar:scan.");
  }

  const projectPath = cwd.replaceAll("\\", "/");
  runChecked(
    "docker",
    [
      "run",
      "--rm",
      "-e",
      "SONAR_HOST_URL",
      "-e",
      "SONAR_TOKEN",
      "-v",
      `${projectPath}:/usr/src`,
      "-w",
      "/usr/src",
      "sonarsource/sonar-scanner-cli:latest",
      "-Dsonar.qualitygate.wait=true"
    ],
    {
      cwd,
      env: {
        ...process.env,
        SONAR_HOST_URL: config.url,
        SONAR_TOKEN: config.token
      }
    }
  );
}

function setupMcp(cwd) {
  const targetPath = path.join(cwd, ".mcp.json");
  const sourcePath = fs.existsSync(targetPath) ? targetPath : path.join(cwd, ".mcp.example.json");
  const config = fs.existsSync(sourcePath)
    ? JSON.parse(fs.readFileSync(sourcePath, "utf8"))
    : { mcpServers: {} };

  config.mcpServers ??= {};
  config.mcpServers.sonarqube = {
    command: "docker",
    args: [
      "run",
      "--rm",
      "-i",
      "-e",
      "SONARQUBE_TOKEN",
      "-e",
      "SONARQUBE_URL",
      "mcp/sonarqube"
    ],
    env: {
      SONARQUBE_TOKEN: "${SONARQUBE_TOKEN}",
      SONARQUBE_URL: "${SONARQUBE_URL}"
    },
    disabled: false,
    disabledTools: ADMIN_MCP_TOOLS,
    autoApprove: []
  };

  fs.writeFileSync(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log("MCP SonarQube local habilitado en .mcp.json sin secretos inline.");
}

async function main() {
  const cwd = path.resolve(process.cwd());
  const command = process.argv[2];
  const config = loadSonarEnv({ cwd });

  try {
    if (!command || command === "--help" || command === "-h") {
      printUsage();
    } else if (command === "doctor") {
      await doctor(config);
    } else if (command === "status") {
      await status(config);
    } else if (command === "issues") {
      await issues(config);
    } else if (command === "gate") {
      await gate(config);
    } else if (command === "scan") {
      scan(config, cwd);
    } else if (command === "setup-mcp") {
      setupMcp(cwd);
    } else {
      throw new Error(`Comando no soportado: ${command}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] ?? "") === path.resolve(__filename)) {
  main();
}
