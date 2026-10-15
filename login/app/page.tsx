const REPO = "https://github.com/adriannvargas/login";

// Se calcula al compilar (export estático): sirve para comprobar qué build está publicado.
const BUILD = new Intl.DateTimeFormat("es", {
  dateStyle: "long",
  timeStyle: "short",
}).format(new Date());

const funciones = [
  {
    icono: "🔐",
    titulo: "Login con JWT",
    texto: "Inicio de sesión seguro con contraseñas cifradas con bcrypt y tokens que expiran en 2 horas.",
  },
  {
    icono: "📝",
    titulo: "Registro",
    texto: "Alta de usuarios con validación de datos y detección de correos duplicados.",
  },
  {
    icono: "👤",
    titulo: "Perfil editable",
    texto: "Nombre, teléfono, ciudad y biografía. El email está protegido y no se puede modificar.",
  },
];

const stack = ["React 18", "Vite", "Node.js", "Express 5", "MongoDB", "JWT", "Playwright", "GitHub Actions"];

const pruebas = [
  "API · Registro",
  "API · Login",
  "API · Perfil",
  "UI · Registro y login",
  "UI · Perfil",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-semibold tracking-tight">Login · Certificación II</span>
        <a
          href={REPO}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-sm transition hover:bg-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          GitHub
        </a>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Desplegado en Firebase Hosting
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Login y perfil de usuario
            <span className="block text-indigo-600 dark:text-indigo-400">full stack</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Registro, inicio de sesión y edición de perfil con React, Express y MongoDB,
            verificado con pruebas automatizadas de Playwright en cada push.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={REPO}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              Ver el código
            </a>
            <a
              href={`${REPO}/actions`}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Ver pruebas en Actions
            </a>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6">
          {funciones.map((f) => (
            <article
              key={f.titulo}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="text-3xl">{f.icono}</div>
              <h2 className="mt-4 text-lg font-semibold">{f.titulo}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.texto}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Tecnologías</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {stack.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Pruebas automatizadas · 5/5</h2>
            <ul className="mt-4 space-y-2">
              {pruebas.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">✔</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800">
        Build publicado el <time data-testid="build">{BUILD}</time> · Adrian Vargas
      </footer>
    </div>
  );
}
