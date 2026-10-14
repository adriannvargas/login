"""Utilidad compartida: ejecuta las 5 pruebas de Playwright del proyecto."""
import os
import re
import subprocess

PROYECTO = os.environ.get("CLAUDE_PROJECT_DIR") or os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)


def ejecutar_pruebas(timeout=280):
    """Devuelve (ok, salida). ok=False si alguna prueba falla o no se ejecutó ninguna."""
    entorno = {k: v for k, v in os.environ.items() if k != "CI"}
    try:
        resultado = subprocess.run(
            "npx playwright test --reporter=line",
            cwd=PROYECTO,
            shell=True,  # en Windows npx es un .cmd
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            env=entorno,
        )
    except subprocess.TimeoutExpired:
        return False, f"Las pruebas superaron el límite de {timeout}s."
    salida = resultado.stdout + resultado.stderr
    ejecutadas = re.search(r"\b[1-9]\d* passed\b|\b[1-9]\d* failed\b", salida)
    return resultado.returncode == 0 and bool(ejecutadas), salida
