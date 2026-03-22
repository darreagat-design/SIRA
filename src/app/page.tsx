import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#12334a_50%,#115e59_100%)] px-8 py-10 text-white shadow-[0_28px_90px_-44px_rgba(15,23,42,0.45)] sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                Sprint 4
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Sistema Inteligente de Reservas Academicas
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                SIRA ya cuenta con interfaz web para registrar usuarios,
                iniciar sesion, revisar espacios activos, consultar
                disponibilidad y crear reservas desde un flujo presentable y
                conectado con la API del proyecto.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Entrar al sistema
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Crear usuario
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                  Flujo del MVP
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-100">
                  Registro, login, dashboard, consulta de disponibilidad y
                  creacion de reservas en una sola experiencia coherente.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                  Presentacion
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-100">
                  La interfaz busca un tono academico, limpio y serio para
                  mostrar el proyecto con seguridad en clase.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              01
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Acceso simple
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El usuario puede registrarse e iniciar sesion desde la interfaz,
              con almacenamiento ligero en `sessionStorage`.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              02
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Dashboard util
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El panel resume el sistema, muestra espacios activos y deja clara
              la siguiente accion del flujo de reservas.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              03
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Reserva conectada
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              La interfaz consulta disponibilidad y crea reservas usando la API
              existente, respetando la validacion de conflictos.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
