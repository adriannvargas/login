# Login + Perfil de usuario (Full Stack)

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + React Router (`frontend/`) |
| Backend | Node.js + Express 5 + JWT + bcrypt (`backend/`) |
| Base de datos | MongoDB real (Mongoose) |
| Pruebas | Playwright: 3 de API + 2 E2E, algunas verifican directamente en MongoDB |
| CI | GitHub Actions: cada test es un job separado, con MongoDB como service container |
| Hooks | Claude Code (`.claude/settings.json`) |

## Funcionalidad
- **Registro** `POST /api/auth/register` y **login** `POST /api/auth/login` → devuelven un JWT.
- **Perfil** `GET /api/profile` y `PUT /api/profile` (requieren `Authorization: Bearer <token>`).
  Campos editables: nombre, teléfono, ciudad, biografía. El email **no** debe ser editable.
- Pantallas: `/login`, `/register`, `/profile` (ruta protegida).

## Ejecutar en local
```bash
npm install
npx playwright install chromium

# 1) Base de datos (elige una)
docker compose up -d          # MongoDB 7 en Docker
npm run db:local              # o un mongod real sin Docker (datos en .local-db/)

# 2) App
npm run build && npm start    # todo en http://localhost:4000
# o en modo desarrollo: npm run dev:api  +  npm run dev:web  (http://localhost:5173)
```
Variables (opcional, ver `.env.example`): `PORT`, `MONGODB_URI`, `JWT_SECRET`.

## Las 5 pruebas
```bash
npx playwright test           # levanta MongoDB y la app automáticamente (puerto 4100)
npx playwright show-report
```
| # | Archivo | Qué verifica |
|---|---|---|
| 1 | `tests/api/01-registro.spec.js` | Registro 201, usuario guardado en MongoDB con hash bcrypt, duplicado 409 |
| 2 | `tests/api/02-login.spec.js` | Login válido devuelve JWT; contraseña/usuario incorrecto 401; datos faltantes 400 |
| 3 | `tests/api/03-perfil-api.spec.js` | Perfil protegido (401 sin token), actualización persistida en MongoDB, email no editable |
| 4 | `tests/e2e/04-login-ui.spec.js` | Registro → logout → login fallido muestra error → login correcto en el navegador |
| 5 | `tests/e2e/05-perfil-ui.spec.js` | `/profile` redirige sin sesión; edición del perfil persiste tras recargar |

## Demo: un test que falla y se resuelve con un hook

El código tiene **un bug intencional**: el backend deja modificar el email desde
`PUT /api/profile` (asignación masiva). Por eso **Test 3 · API Perfil falla siempre**
y GitHub Actions lo marca en rojo (4 jobs verdes, 1 rojo).

Hooks configurados en `.claude/settings.json` (los ejecuta Claude Code, no el modelo):

| Hook | Evento | Qué hace |
|---|---|---|
| `proteger_tests.py` | PreToolUse · Edit\|Write | Bloquea editar `tests/`, `playwright.config.js`, workflows y `.claude/` |
| `ejecutar_tests.py` | PostToolUse · Edit\|Write | Tras editar `backend/` o `frontend/` ejecuta las 5 pruebas; si fallan, `exit 2` |
| `verificar_push.py` | PreToolUse · Bash\|PowerShell | Antes de `git push` ejecuta las pruebas; si fallan, bloquea el push |

Pasos:
1. Sube el repo **manualmente** (`git push`): Actions muestra el Test 3 en rojo.
2. Abre Claude Code en esta carpeta y verifica con `/hooks` que aparecen los 3.
3. Pídele:
   > Haz git push. Si el hook bloquea el push por pruebas fallidas, corrige el código
   > sin modificar los tests ni desactivar los hooks, crea un commit y vuelve a hacer push.
4. El hook bloquea el push y le entrega el reporte → el agente corrige `backend/` →
   el hook de pruebas confirma 5/5 → commit → push permitido → Actions queda todo en verde.

> Si el agente intenta "arreglarlo" cambiando la prueba, `proteger_tests.py` lo bloquea.
