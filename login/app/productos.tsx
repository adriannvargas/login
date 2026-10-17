"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

// Backend desplegado en Render (repo backendUpbtest). Se puede cambiar al compilar con NEXT_PUBLIC_API_URL.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://backendupbtest.onrender.com";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  createdAt: string;
};

// Devuelve el JSON de la respuesta o lanza el mensaje de error que manda la API
async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${ruta}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 204) return undefined as T;
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) throw new Error(cuerpo?.error ?? `Error ${res.status}`);
  return cuerpo as T;
}

const campo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async (texto: string) => {
    setCargando(true);
    setError("");
    try {
      const query = texto.trim() ? `?nombre=${encodeURIComponent(texto.trim())}` : "";
      setProductos(await pedir<Producto[]>(`/api/productos${query}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo conectar con la API");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Render apaga el servicio gratuito por inactividad: la primera carga puede tardar ~1 min
    let activo = true;
    pedir<Producto[]>("/api/productos")
      .then((lista) => activo && setProductos(lista))
      .catch((e) => activo && setError(e instanceof Error ? e.message : "No se pudo conectar con la API"))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const crear = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await pedir<Producto>("/api/productos", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          precio: precio === "" ? undefined : Number(precio),
          stock: stock === "" ? undefined : Number(stock),
        }),
      });
      setNombre("");
      setPrecio("");
      setStock("");
      await cargar(busqueda);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el producto");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: number) => {
    setError("");
    try {
      await pedir<void>(`/api/productos/${id}`, { method: "DELETE" });
      setProductos((lista) => lista.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar el producto");
    }
  };

  return (
    <section id="productos" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold">Productos · API en Render</h2>
          <a href={API_URL} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            {API_URL.replace(/^https?:\/\//, "")}
          </a>
        </div>

        <form onSubmit={crear} className="mt-5 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            aria-label="Nombre"
            placeholder="Nombre"
            required
            maxLength={100}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={campo}
          />
          <input
            aria-label="Precio"
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className={campo}
          />
          <input
            aria-label="Stock"
            placeholder="Stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={campo}
          />
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Agregar"}
          </button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            cargar(busqueda);
          }}
          className="mt-3 flex gap-3"
        >
          <input
            aria-label="Buscar por nombre"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={campo}
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Buscar
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando productos… (si el servidor estaba dormido puede tardar un minuto)</p>
          ) : productos.length === 0 ? (
            <p className="text-sm text-slate-500">No hay productos.</p>
          ) : (
            <table data-testid="tabla-productos" className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">#</th>
                  <th className="py-2 pr-4 font-medium">Nombre</th>
                  <th className="py-2 pr-4 font-medium">Precio</th>
                  <th className="py-2 pr-4 font-medium">Stock</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2 pr-4 text-slate-500">{p.id}</td>
                    <td className="py-2 pr-4">{p.nombre}</td>
                    <td className="py-2 pr-4">Bs {Number(p.precio).toFixed(2)}</td>
                    <td className="py-2 pr-4">{p.stock}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => eliminar(p.id)}
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
