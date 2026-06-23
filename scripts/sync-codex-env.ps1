param(
  [string]$EnvFile = ".env.local",
  [ValidateSet("Process", "User", "Both")]
  [string]$Target = "Both",
  [switch]$Preview
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-ProjectPath {
  param([string]$Path)

  if ([System.IO.Path]::IsPathRooted($Path)) {
    return $Path
  }

  return Join-Path -Path (Get-Location) -ChildPath $Path
}

function Convert-DotEnvLine {
  param([string]$Line)

  $trimmedLine = $Line.Trim()

  if ($trimmedLine.Length -eq 0 -or $trimmedLine.StartsWith("#")) {
    return $null
  }

  if ($trimmedLine.StartsWith("export ")) {
    $trimmedLine = $trimmedLine.Substring(7).Trim()
  }

  $separatorIndex = $trimmedLine.IndexOf("=")
  if ($separatorIndex -le 0) {
    return $null
  }

  $name = $trimmedLine.Substring(0, $separatorIndex).Trim()
  $value = $trimmedLine.Substring($separatorIndex + 1).Trim()

  if ($name -notmatch "^[A-Za-z_][A-Za-z0-9_]*$") {
    throw "Nombre de variable invalido en ${EnvFile}: $name"
  }

  if (
    ($value.StartsWith('"') -and $value.EndsWith('"')) -or
    ($value.StartsWith("'") -and $value.EndsWith("'"))
  ) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  return [PSCustomObject]@{
    Name = $name
    Value = $value
  }
}

function Set-CodexEnvironmentVariable {
  param(
    [string]$Name,
    [string]$Value,
    [string]$Target
  )

  if ($Target -eq "Process" -or $Target -eq "Both") {
    [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
  }

  if ($Target -eq "User" -or $Target -eq "Both") {
    [Environment]::SetEnvironmentVariable($Name, $Value, "User")
  }
}

$resolvedEnvFile = Resolve-ProjectPath -Path $EnvFile
if (-not (Test-Path -LiteralPath $resolvedEnvFile -PathType Leaf)) {
  throw "No existe el archivo: $resolvedEnvFile"
}

$variables = [ordered]@{}
foreach ($line in Get-Content -LiteralPath $resolvedEnvFile) {
  $entry = Convert-DotEnvLine -Line $line
  if ($null -eq $entry) {
    continue
  }

  $variables[$entry.Name] = $entry.Value
}

# Keep legacy project names compatible with MCP server names.
$aliases = @{
  SONAR_HOST_URL = "SONARQUBE_URL"
  SONAR_TOKEN = "SONARQUBE_TOKEN"
  SONAR_PROJECT_KEY = "SONARQUBE_PROJECT_KEY"
}

foreach ($legacyName in $aliases.Keys) {
  $targetName = $aliases[$legacyName]
  if ($variables.Contains($legacyName) -and -not $variables.Contains($targetName)) {
    $variables[$targetName] = $variables[$legacyName]
  }
}

if ($variables.Count -eq 0) {
  throw "No se encontraron variables validas en: $resolvedEnvFile"
}

if (-not $Preview) {
  foreach ($name in $variables.Keys) {
    Set-CodexEnvironmentVariable -Name $name -Value $variables[$name] -Target $Target
  }
}

$requiredNames = @(
  "SONARQUBE_URL",
  "SONARQUBE_TOKEN",
  "SONARQUBE_PROJECT_KEY"
)

$publishedRows = foreach ($name in $variables.Keys) {
  [PSCustomObject]@{
    Variable = $name
    Status = if ($Preview) { "preview" } else { "cargada" }
  }
}

$missingRows = foreach ($name in $requiredNames) {
  if (-not $variables.Contains($name)) {
    [PSCustomObject]@{
      Variable = $name
      Status = "faltante"
    }
  }
}

Write-Host ""
Write-Host "Variables procesadas sin imprimir valores:"
$publishedRows | Sort-Object Variable | Format-Table -AutoSize

if ($missingRows) {
  Write-Host ""
  Write-Host "Variables recomendadas faltantes:"
  $missingRows | Format-Table -AutoSize
}

Write-Host ""
if ($Preview) {
  Write-Host "Modo preview: no se modifico el entorno."
} elseif ($Target -eq "User" -or $Target -eq "Both") {
  Write-Host "Listo. Reinicia Codex para que herede las variables actualizadas."
} else {
  Write-Host "Listo. Variables disponibles en esta sesion PowerShell."
}
