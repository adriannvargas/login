"""HOOK 2 · PostToolUse (Edit|Write)
Después de editar código de backend/ o frontend/ ejecuta las 5 pruebas.
Si fallan → exit 2: el reporte le llega a Claude, que se corrige solo.
Si pasan  → exit 0 + systemMessage verde para el usuario.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pruebas import ejecutar_pruebas  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

datos = json.loads(sys.stdin.buffer.read().decode("utf-8"))
ruta = datos.get("tool_input", {}).get("file_path", "").replace("\\", "/")

if not any(f"/{carpeta}/" in ruta for carpeta in ("backend", "frontend")):
    sys.exit(0)

ok, salida = ejecutar_pruebas()
if not ok:
    print(
        "❌ El hook ejecutó las pruebas después de tu cambio y FALLARON.\n"
        "Corrige el código (las pruebas no se pueden modificar):\n\n" + salida[-4000:],
        file=sys.stderr,
    )
    sys.exit(2)

resumen = next((l for l in reversed(salida.splitlines()) if "passed" in l), "OK")
print(json.dumps({"systemMessage": f"✅ Hook de pruebas: {resumen.strip()}"}, ensure_ascii=False))
sys.exit(0)
