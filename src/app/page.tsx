export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur sm:p-12">
        <div className="mb-10 space-y-4">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Sprint 1
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            SIRA deja listo su entorno tecnico inicial.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Esta aplicacion solo expone la base del proyecto: Next.js con
            TypeScript y Tailwind, Prisma preparado para PostgreSQL y una
            estructura limpia para continuar en el siguiente sprint.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Incluido en este sprint
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Next.js con App Router y TypeScript.</li>
              <li>Tailwind CSS listo para estilos futuros.</li>
              <li>Prisma conectado por variables de entorno.</li>
              <li>Docker Compose para PostgreSQL local.</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Fuera de alcance por ahora
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Sin modelos de negocio finales en Prisma.</li>
              <li>Sin autenticacion ni endpoints funcionales.</li>
              <li>Sin pantallas de login, dashboard o reservas.</li>
              <li>Sin logica de disponibilidad o doble reserva.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
