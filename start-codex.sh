#!/usr/bin/env sh
# FromZero: carga .env.local en esta sesion y lanza codex. No imprime valores.
DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
if [ -f "$DIR/.env.local" ]; then
  set -a
  . "$DIR/.env.local"
  set +a
fi
exec codex "$@"
