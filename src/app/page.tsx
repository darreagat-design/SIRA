export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur sm:p-12">
        <div className="mb-10 space-y-4">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Sprint 3
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            SIRA deja lista la API base del MVP.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Esta aplicacion mantiene la base tecnica y de persistencia del
            proyecto, y ahora suma endpoints para registro, login, espacios,
            disponibilidad y reservas con validaciones reutilizables.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Incluido en este sprint
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Registro de usuarios con password hash usando bcrypt.</li>
              <li>Login basico sin JWT ni cookies.</li>
              <li>Consulta de espacios activos y disponibilidad.</li>
              <li>Creacion de reservas con validacion de conflicto horario.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Fuera de alcance por ahora
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Sin interfaz funcional completa del sistema.</li>
              <li>Sin JWT, cookies ni middleware de autenticacion.</li>
              <li>Sin dashboard, login visual o flujo de reserva en UI.</li>
              <li>Sin funcionalidades del Sprint 4.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
