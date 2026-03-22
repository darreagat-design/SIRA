"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { EmptyState } from "@/components/EmptyState";
import { FeedbackAlert } from "@/components/FeedbackAlert";
import { SpaceList } from "@/components/SpaceList";
import { clearSessionUser, readSessionUser, type SessionUser } from "@/lib/session";

type Space = {
  id: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  capacidad: number;
  descripcion: string;
  activo: boolean;
};

type SpacesResponse = {
  ok: boolean;
  message: string;
  data?: Space[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = readSessionUser();

    if (!storedUser) {
      startTransition(() => {
        router.replace("/login");
      });
      return;
    }

    setUser(storedUser);

    async function loadSpaces() {
      try {
        const response = await fetch("/api/espacios", { cache: "no-store" });
        const result = (await response.json()) as SpacesResponse;

        if (!response.ok || !result.ok || !result.data) {
          setError(result.message || "No fue posible cargar los espacios activos.");
          return;
        }

        setSpaces(result.data);
      } catch {
        setError("No fue posible cargar los espacios activos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSpaces();
  }, [router]);

  function handleLogout() {
    clearSessionUser();
    startTransition(() => {
      router.replace("/login");
    });
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-5 text-sm text-slate-600 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
          Cargando sesión...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader
          userName={user.nombre}
          title="Dashboard académico"
          subtitle="Revisa el estado general del sistema, explora los espacios activos y continua al flujo de reserva desde un panel ordenado y presentable."
          onLogout={handleLogout}
          currentPath="dashboard"
        />

        {error ? (
          <FeedbackAlert
            title="Error cargando datos"
            message={error}
            tone="error"
          />
        ) : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <DashboardCard
            eyebrow="Espacios activos"
            title={isLoading ? "..." : String(spaces.length)}
            description="Cantidad de espacios actualmente activos y visibles para consultas y reservas."
            accent="teal"
          />

          <DashboardCard
            eyebrow="Nueva reserva"
            title="Flujo listo"
            description="Consulta disponibilidad, revisa el espacio ideal y registra la reserva desde la siguiente pantalla."
            accent="slate"
            action={
              <Link
                href="/reserva"
                className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ir a reservar
              </Link>
            }
          />

          <DashboardCard
            eyebrow="Sistema"
            title="MVP conectado"
            description="La interfaz del Sprint 4 ya consume la API real de usuarios, espacios, disponibilidad y reservas."
            accent="amber"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Espacios disponibles
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Catalogo de espacios activos
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Vista general de salones, laboratorios y auditorios listos para ser consultados o reservados.
                </p>
              </div>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-44 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              ) : (
                <SpaceList
                  spaces={spaces}
                  emptyTitle="No hay espacios activos"
                  emptyDescription="Cuando el sistema tenga espacios activos sembrados o registrados, apareceran aqui para su consulta."
                />
              )}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Reservas recientes
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Actividad de reservas
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Esta sección queda preparada para mostrar actividad reciente cuando el proyecto agregue un endpoint especifico en el siguiente sprint de pulido.
            </p>

            <div className="mt-6">
              <EmptyState
                title="Sin reservas recientes para mostrar"
                description="La UI ya reserva espacios correctamente, pero este panel aun no consume una fuente especifica de historial. Queda listo para el siguiente paso del proyecto."
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-teal-200 bg-teal-50 p-5">
              <p className="text-sm font-semibold text-teal-900">Siguiente accion sugerida</p>
              <p className="mt-2 text-sm leading-6 text-teal-800">
                Consulta disponibilidad para una fecha y crea una reserva de demostracion desde la pantalla de reservas.
              </p>
              <Link
                href="/reserva"
                className="mt-4 inline-flex rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Abrir formulario de reserva
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
