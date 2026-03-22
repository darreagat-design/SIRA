"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { AuthCard } from "@/components/AuthCard";
import { FeedbackAlert } from "@/components/FeedbackAlert";
import { readSessionUser, saveSessionUser } from "@/lib/session";

type LoginResponse = {
  ok: boolean;
  message: string;
  data?: {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
  };
};

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = readSessionUser();

    if (storedUser) {
      startTransition(() => {
        router.replace("/dashboard");
      });
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!correo.trim() || !password.trim()) {
      setFeedback({
        tone: "error",
        title: "Campos incompletos",
        message: "Ingresa tu correo y tu contrasena para continuar.",
      });
      return;
    }

    if (!isValidEmail(correo.trim())) {
      setFeedback({
        tone: "error",
        title: "Correo invalido",
        message: "Verifica el formato del correo antes de continuar.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo.trim(),
          password,
        }),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.ok || !result.data) {
        setFeedback({
          tone: "error",
          title: "No fue posible iniciar sesion",
          message: result.message || "Verifica tus credenciales e intenta nuevamente.",
        });
        return;
      }

      saveSessionUser(result.data);
      setFeedback({
        tone: "success",
        title: "Sesion iniciada",
        message: "Redirigiendo al dashboard de SIRA.",
      });

      startTransition(() => {
        router.push("/dashboard");
      });
    } catch {
      setFeedback({
        tone: "error",
        title: "Error de conexion",
        message: "No se pudo contactar la API. Intenta de nuevo en unos segundos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      badge="Acceso"
      title="Inicia sesion en SIRA"
      description="Accede al panel para consultar espacios, revisar disponibilidad y crear reservas academicas."
      asideTitle="Gestion de reservas con una experiencia clara y academica."
      asideDescription="SIRA concentra el flujo minimo del MVP en una interfaz limpia para demostraciones, pruebas y evolucion del proyecto."
      asidePoints={[
        "Consulta espacios activos ordenados y listos para reservar.",
        "Valida disponibilidad antes de apartar un salon, laboratorio o auditorio.",
        "Trabaja con una experiencia sobria, seria y facil de presentar en clase.",
      ]}
      footerText="Aun no tienes cuenta?"
      footerLinkLabel="Registrate aqui"
      footerHref="/register"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="correo">
            Correo institucional o academico
          </label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="usuario@institucion.edu"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="Ingresa tu contrasena"
          />
        </div>

        {feedback ? (
          <FeedbackAlert
            title={feedback.title}
            message={feedback.message}
            tone={feedback.tone}
          />
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? "Validando acceso..." : "Entrar al dashboard"}
        </button>

        <Link
          href="/"
          className="block text-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          Volver al inicio
        </Link>
      </form>
    </AuthCard>
  );
}
