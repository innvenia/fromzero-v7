# FromZero: carga las variables de .env.local en esta sesion y lanza codex.
# No imprime valores. Generado por load-env-local.mjs --setup.
$ErrorActionPreference = 'Stop'
$envFile = Join-Path $PSScriptRoot '.env.local'
if (Test-Path $envFile) {
  foreach ($line in Get-Content $envFile) {
    $t = $line.Trim()
    if ($t -eq '' -or $t.StartsWith('#') -or ($t -notmatch '=')) { continue }
    if ($t.StartsWith('export ')) { $t = $t.Substring(7).Trim() }
    $i = $t.IndexOf('=')
    $name = $t.Substring(0, $i).Trim()
    $value = $t.Substring($i + 1).Trim().Trim('"').Trim("'")
    [Environment]::SetEnvironmentVariable($name, $value, 'Process')
  }
}
codex @args
