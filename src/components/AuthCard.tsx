import type { ReactNode } from "react";
import Link from "next/link";

type AuthCardProps = {
  badge: string;
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  asidePoints: string[];
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  children: ReactNode;
};

export function AuthCard({
  badge,
  title,
  description,
  asideTitle,
  asideDescription,
  asidePoints,
  footerText,
  footerLinkLabel,
  footerHref,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#0f3a53_55%,#0f766e_100%)] px-8 py-10 text-white lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.26),transparent_32%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium tracking-wide text-white/90">
              {badge}
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {asideTitle}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
              {asideDescription}
            </p>

            {asidePoints.length ? (
              <div className="mt-10 grid gap-4">
                {asidePoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 backdrop-blur"
                  >
                    <p className="text-sm leading-6 text-slate-100">{point}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
              {badge}
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-6 text-sm text-slate-500">
              {footerText}{" "}
              <Link className="font-semibold text-teal-700 hover:text-teal-800" href={footerHref}>
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
