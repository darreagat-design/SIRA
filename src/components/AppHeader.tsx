import Link from "next/link";

type AppHeaderProps = {
  userName: string;
  title: string;
  subtitle: string;
  onLogout: () => void;
  currentPath?: "dashboard" | "reserva";
};

export function AppHeader({
  userName,
  title,
  subtitle,
  onLogout,
  currentPath = "dashboard",
}: AppHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              SIRA
            </span>
            <span className="text-sm text-slate-500">Hola, {userName}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              currentPath === "dashboard"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/reserva"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              currentPath === "reserva"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Nueva reserva
          </Link>
          <button
            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            onClick={onLogout}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </header>
  );
}
