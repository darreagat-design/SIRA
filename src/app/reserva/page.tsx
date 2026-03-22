"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
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

type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export default function ReservaPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

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
        const result = (await response.json()) as ApiResponse<Space[]>;

        if (!response.ok || !result.ok || !result.data) {
          setFeedback({
            tone: "error",
            title: "No fue posible cargar espacios",
            message: result.message || "Intenta de nuevo en unos segundos.",
          });
          return;
        }

        setSpaces(result.data);
        if (result.data[0]) {
          setSelectedSpaceId(result.data[0].id);
        }
      } catch {
        setFeedback({
          tone: "error",
          title: "Error de conexion",
          message: "No se pudieron obtener los espacios activos del sistema.",
        });
      } finally {
        setIsLoadingSpaces(false);
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

  function validateReservationForm() {
    if (!selectedSpaceId || !fecha || !horaInicio || !horaFin || !motivo.trim()) {
      return "Completa espacio, fecha, horario y motivo antes de continuar.";
    }

    if (!isValidDate(fecha)) {
      return "La fecha debe usar el formato YYYY-MM-DD.";
    }

    if (!isValidTime(horaInicio) || !isValidTime(horaFin)) {
      return "Las horas deben usar el formato HH:mm.";
    }

    if (horaInicio >= horaFin) {
      return "La hora de inicio debe ser menor que la hora de fin.";
    }

    return null;
  }

  async function handleCheckAvailability() {
    const validationMessage = validateReservationForm();

    if (validationMessage) {
      setFeedback({
        tone: "warning",
        title: "Formulario incompleto",
        message: validationMessage,
      });
      return;
    }

    setIsCheckingAvailability(true);
    setFeedback(null);

    try {
      const params = new URLSearchParams({
        fecha,
        horaInicio,
        horaFin,
      });

      const response = await fetch(`/api/disponibilidad?${params.toString()}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as ApiResponse<Space[]>;

      if (!response.ok || !result.ok || !result.data) {
        setFeedback({
          tone: "error",
          title: "Consulta no completada",
          message: result.message || "No fue posible consultar la disponibilidad.",
        });
        return;
      }

      setAvailableSpaces(result.data);
      const selectedSpaceAvailable = result.data.some((space) => space.id === selectedSpaceId);

      setFeedback({
        tone: selectedSpaceAvailable ? "success" : "warning",
        title: selectedSpaceAvailable
          ? "Espacio disponible"
          : "Espacio con conflicto",
        message: selectedSpaceAvailable
          ? "El espacio seleccionado aparece disponible para ese horario."
          : "El espacio seleccionado no aparece libre en ese horario, pero puedes revisar otras opciones disponibles.",
      });
    } catch {
      setFeedback({
        tone: "error",
        title: "Error de conexion",
        message: "No fue posible consultar la disponibilidad en este momento.",
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  }

  async function handleCreateReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setFeedback({
        tone: "error",
        title: "Sesion no encontrada",
        message: "Vuelve a iniciar sesion para continuar.",
      });
      return;
    }

    const validationMessage = validateReservationForm();

    if (validationMessage) {
      setFeedback({
        tone: "warning",
        title: "Formulario incompleto",
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id,
          espacioId: selectedSpaceId,
          fecha,
          horaInicio,
          horaFin,
          motivo: motivo.trim(),
        }),
      });

      const result = (await response.json()) as ApiResponse<{
        id: string;
      }>;

      if (!response.ok || !result.ok) {
        setFeedback({
          tone: response.status === 409 ? "warning" : "error",
          title: response.status === 409 ? "Conflicto detectado" : "Reserva no creada",
          message: result.message || "No fue posible crear la reserva.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        title: "Reserva creada",
        message: "La reserva se registro correctamente en el sistema.",
      });
      setAvailableSpaces([]);
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      setMotivo("");
    } catch {
      setFeedback({
        tone: "error",
        title: "Error de conexion",
        message: "No fue posible enviar la reserva a la API.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedSpace = spaces.find((space) => space.id === selectedSpaceId) ?? null;
  const selectedSpaceAvailable = availableSpaces.some((space) => space.id === selectedSpaceId);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-5 text-sm text-slate-600 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]">
          Cargando sesion...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader
          userName={user.nombre}
          title="Nueva reserva academica"
          subtitle="Selecciona un espacio, revisa disponibilidad para la fecha elegida y registra la reserva directamente desde la interfaz web."
          onLogout={handleLogout}
          currentPath="reserva"
        />

        {feedback ? (
          <FeedbackAlert
            title={feedback.title}
            message={feedback.message}
            tone={feedback.tone}
          />
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Formulario
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Registrar reserva
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consulta la disponibilidad antes de reservar para reducir conflictos y confirmar rápidamente si el espacio elegido esta libre.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleCreateReservation}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="espacio">
                  Espacio
                </label>
                <select
                  id="espacio"
                  value={selectedSpaceId}
                  onChange={(event) => setSelectedSpaceId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  disabled={isLoadingSpaces}
                >
                  {spaces.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.nombre} - {space.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="fecha">
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(event) => setFecha(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="motivo">
                    Motivo
                  </label>
                  <input
                    id="motivo"
                    type="text"
                    value={motivo}
                    onChange={(event) => setMotivo(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    placeholder="Clase especial, reunión, practica..."
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="horaInicio">
                    Hora de inicio
                  </label>
                  <input
                    id="horaInicio"
                    type="time"
                    value={horaInicio}
                    onChange={(event) => setHoraInicio(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="horaFin">
                    Hora de fin
                  </label>
                  <input
                    id="horaFin"
                    type="time"
                    value={horaFin}
                    onChange={(event) => setHoraFin(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={isCheckingAvailability || isLoadingSpaces}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {isCheckingAvailability ? "Consultando..." : "Consultar disponibilidad"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingSpaces}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? "Creando reserva..." : "Crear reserva"}
                </button>
              </div>
            </form>
          </article>

          <div className="flex flex-col gap-6">
            <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Espacio seleccionado
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Resumen del espacio
              </h2>

              {selectedSpace ? (
                <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                        {selectedSpace.tipo}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">
                        {selectedSpace.nombre}
                      </h3>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {selectedSpace.capacidad} personas
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {selectedSpace.ubicacion}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {selectedSpace.descripcion}
                  </p>

                  {availableSpaces.length ? (
                    <div
                      className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                        selectedSpaceAvailable
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-amber-200 bg-amber-50 text-amber-900"
                      }`}
                    >
                      {selectedSpaceAvailable
                        ? "El espacio seleccionado aparece disponible en la última consulta."
                        : "El espacio seleccionado no aparece disponible en la última consulta realizada."}
                    </div>
                  ) : null}
                </div>
              ) : (
                <EmptyState
                  title="Sin espacio seleccionado"
                  description="Cuando carguen los espacios activos podras elegir uno y revisar su disponibilidad."
                />
              )}
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Disponibilidad
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Espacios libres para el horario consultado
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                El sistema muestra solo los espacios activos que no tienen cruces de horario con reservas ya registradas.
              </p>

              <div className="mt-6">
                {isCheckingAvailability ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[0, 1].map((item) => (
                      <div
                        key={item}
                        className="h-40 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-100"
                      />
                    ))}
                  </div>
                ) : availableSpaces.length ? (
                  <SpaceList
                    spaces={availableSpaces}
                    emptyTitle="No hay espacios disponibles"
                    emptyDescription="Ajusta la fecha u horario y vuelve a consultar para encontrar opciones disponibles."
                  />
                ) : (
                  <EmptyState
                    title="Aún no has consultado disponibilidad"
                    description="Completa fecha y horario, luego usa el botón de consulta para ver los espacios libres antes de reservar."
                  />
                )}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
