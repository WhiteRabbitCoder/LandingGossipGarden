#!/usr/bin/env bash
# Genera blog/components/supabase-config.js desde .env (solo variables PÚBLICAS).
# El blog vive en su propio dominio (carpeta blog/).
# Uso:  ./scripts/gen-config.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env"
OUT="$ROOT/blog/components/supabase-config.js"

[ -f "$ENV_FILE" ] || { echo "ERROR: no existe $ENV_FILE (copia .env.example a .env)"; exit 1; }

# Lee una clave del .env sin ejecutar el archivo (evita sorpresas).
read_var() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2-; }

URL="$(read_var SUPABASE_URL)"
ANON="$(read_var SUPABASE_ANON_KEY)"

[ -n "$URL" ]  || { echo "ERROR: falta SUPABASE_URL en .env"; exit 1; }
[ -n "$ANON" ] || { echo "ERROR: falta SUPABASE_ANON_KEY en .env"; exit 1; }

cat > "$OUT" <<EOF
/* ───────────────────────────────────────────────────────────────────────────
   ARCHIVO GENERADO automáticamente por scripts/gen-config.sh desde .env.
   NO lo edites a mano ni lo commitees (está en .gitignore).
   Solo contiene las dos variables PÚBLICAS que necesita el navegador.
   ─────────────────────────────────────────────────────────────────────────── */
window.SUPABASE_URL      = "$URL";
window.SUPABASE_ANON_KEY = "$ANON";
EOF

echo "OK  -> $OUT"
