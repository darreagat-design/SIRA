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

type Reservation = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: string;
  espacio: {
    id: string;
    nombre: string;
    tipo: string;
    ubicacion: string;
  };
};

type ReservationsResponse = {
  ok: boolean;
  message: string;
  data?: Reservation[];
};

function formatReservationDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = readSessionUser();

    if (!storedUser) {
      startTransition(() => {
        router.replace("/login");
      });
      return;
    }

    const sessionUser = storedUser;

    setUser(sessionUser);

    async function loadDashboardData() {
      try {
        const [spacesResponse, reservationsResponse] = await Promise.all([
          fetch("/api/espacios", { cache: "no-store" }),
          fetch(`/api/mis-reservas?usuarioId=${sessionUser.id}`, { cache: "no-store" }),
        ]);

        const spacesResult = (await spacesResponse.json()) as SpacesResponse;
        const reservationsResult = (await reservationsResponse.json()) as ReservationsResponse;

        if (!spacesResponse.ok || !spacesResult.ok || !spacesResult.data) {
          setError(spacesResult.message || "No fue posible cargar los espacios activos.");
          return;
        }

        if (
          !reservationsResponse.ok ||
          !reservationsResult.ok ||
          !reservationsResult.data
        ) {
          setError(
            reservationsResult.message || "No fue posible cargar las reservas del usuario.",
          );
          return;
        }

        setSpaces(spacesResult.data);
        setReservations(reservationsResult.data);
      } catch {
        setError("No fue posible cargar la informacion del dashboard.");
      } finally {
        setIsLoading(false);
        setIsLoadingReservations(false);
      }
    }

    void loadDashboardData();
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
          title="Dashboard académico" subtitle=" "
         
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
            title="Fácil y Rápido"
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
            eyebrow="Mis reservas"
            title={isLoadingReservations ? "..." : String(reservations.length)}
            description="Reservas registradas con tu usuario y visibles en tiempo real dentro del dashboard."
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

          <aside>
            <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Mis reservas
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Reservas registradas
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Resumen real de las reservas creadas con tu usuario dentro del sistema.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {isLoadingReservations ? (
                  [0, 1].map((item) => (
                    <div
                      key={item}
                      className="h-40 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-100"
                    />
                  ))
                ) : reservations.length ? (
                  reservations.map((reservation) => (
                    <article
                      key={reservation.id}
                      className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                            {reservation.espacio.tipo}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-950">
                            {reservation.espacio.nombre}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">
                            {reservation.espacio.ubicacion}
                          </p>
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-800">
                          {reservation.estado}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-800">Fecha:</span>{" "}
                          {formatReservationDate(reservation.fecha)}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Horario:</span>{" "}
                          {reservation.horaInicio} - {reservation.horaFin}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Motivo:</span>{" "}
                          {reservation.motivo}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyState
                    title="Aun no tienes reservas registradas"
                    description="Cuando crees una reserva desde el formulario, aparecera aqui con el espacio, horario, motivo y estado."
                  />
                )}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
