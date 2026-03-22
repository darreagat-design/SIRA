import type { ReactNode } from "react";

type DashboardCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "teal" | "slate" | "amber";
  action?: ReactNode;
};

const accentStyles = {
  teal: "from-teal-500/15 to-emerald-500/10 border-teal-200/80",
  slate: "from-slate-500/15 to-slate-300/10 border-slate-200",
  amber: "from-amber-400/20 to-orange-300/10 border-amber-200/80",
};

export function DashboardCard({
  eyebrow,
  title,
  description,
  accent = "slate",
  action,
}: DashboardCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] ${accentStyles[accent]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </article>
  );
}
