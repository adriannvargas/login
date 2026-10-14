"""HOOK 1 · PreToolUse (Edit|Write)
Impide que el agente "arregle" un fallo modificando las pruebas, el workflow o los hooks.
exit 2 → la edición se bloquea y Claude lee el motivo (stderr).
"""
import json
import sys

sys.stderr.reconfigure(encoding="utf-8")

datos = json.loads(sys.stdin.buffer.read().decode("utf-8"))
ruta = datos.get("tool_input", {}).get("file_path", "").replace("\\", "/")

PROTEGIDOS = {
    "/tests/": "es una prueba automatizada",
    "playwright.config.js": "es la configuración de las pruebas",
    "/.github/workflows/": "es el pipeline de GitHub Actions",
    "/.claude/": "es la configuración de los hooks",
}

for patron, motivo in PROTEGIDOS.items():
    if patron in ruta:
        print(
            f"⛔ BLOQUEADO por hook: '{ruta.split('/')[-1]}' {motivo}. "
            "Si una prueba falla, corrige el código de backend/ o frontend/, no la prueba.",
            file=sys.stderr,
        )
        sys.exit(2)

sys.exit(0)
