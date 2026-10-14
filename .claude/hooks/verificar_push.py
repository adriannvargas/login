"""HOOK 3 · PreToolUse (Bash|PowerShell)
Antes de un `git push` del agente ejecuta las 5 pruebas. Si alguna falla, bloquea el push
(exit 2) y le entrega el reporte para que corrija el código, haga commit y reintente.
No afecta al `git push` que hagas tú manualmente desde tu terminal.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pruebas import ejecutar_pruebas  # noqa: E402

sys.stderr.reconfigure(encoding="utf-8")

datos = json.loads(sys.stdin.buffer.read().decode("utf-8"))
comando = datos.get("tool_input", {}).get("command", "")

# Cubre git push, git.exe push y opciones globales como git -C ruta push
if not re.search(r"\bgit(?:\.exe)?\b[^\r\n;&|]*\bpush\b", comando, re.IGNORECASE):
    sys.exit(0)

ok, salida = ejecutar_pruebas()
if not ok:
    print(
        "⛔ PUSH BLOQUEADO por hook: hay pruebas fallando.\n"
        "Corrige el código sin modificar los tests ni desactivar los hooks, ejecuta "
        "`npx playwright test`, crea un nuevo commit con la corrección y reintenta el push.\n\n"
        + salida[-5000:],
        file=sys.stderr,
    )
    sys.exit(2)

print("✅ Hook previo al push: las 5 pruebas pasan; se permite el push.", file=sys.stderr)
sys.exit(0)
