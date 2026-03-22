import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#12334a_55%,#115e59_100%)] px-8 py-10 text-white shadow-[0_28px_90px_-44px_rgba(15,23,42,0.45)] sm:px-10 sm:py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Sistema Inteligente de Reservas Academicas
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg">
            SIRA permite registrar usuarios, iniciar sesion, consultar espacios
            activos, revisar disponibilidad y crear reservas academicas desde un
            flujo web simple y presentable.
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
      </section>
    </main>
  );
}
