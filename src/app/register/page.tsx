"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { AuthCard } from "@/components/AuthCard";
import { FeedbackAlert } from "@/components/FeedbackAlert";
import { readSessionUser } from "@/lib/session";

type RegisterResponse = {
  ok: boolean;
  message: string;
};

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
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

    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      setFeedback({
        tone: "error",
        title: "Campos incompletos",
        message: "Completa nombre, correo y contrasena para registrar la cuenta.",
      });
      return;
    }

    if (!isValidEmail(correo.trim())) {
      setFeedback({
        tone: "error",
        title: "Correo invalido",
        message: "El correo debe tener un formato valido.",
      });
      return;
    }

    if (password.trim().length < 6) {
      setFeedback({
        tone: "error",
        title: "Contrasena corta",
        message: "La contrasena debe tener al menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          password,
        }),
      });

      const result = (await response.json()) as RegisterResponse;

      if (!response.ok || !result.ok) {
        setFeedback({
          tone: "error",
          title: "Registro no completado",
          message: result.message || "No fue posible crear el usuario.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        title: "Cuenta creada",
        message: "Tu usuario fue registrado correctamente. Ya puedes iniciar sesion.",
      });
      setNombre("");
      setCorreo("");
      setPassword("");
    } catch {
      setFeedback({
        tone: "error",
        title: "Error de conexion",
        message: "No se pudo contactar la API. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      badge="Registro"
      title="Crea tu usuario en SIRA"
      description="Prepara una cuenta simple para explorar el dashboard y comenzar a registrar reservas academicas."
      asideTitle="Una base visual seria para presentar el MVP con seguridad."
      asideDescription="El flujo de registro se mantiene sencillo para el proyecto academico, pero ya conecta con la API real y con la persistencia configurada."
      asidePoints={[
        "El usuario se registra desde la UI consumiendo la API del proyecto.",
        "Las contrasenas se almacenan con hash usando bcrypt en el backend.",
        "Despues del registro puedes pasar a login y continuar al dashboard.",
      ]}
      footerText="Ya tienes cuenta?"
      footerLinkLabel="Inicia sesion"
      footerHref="/login"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="nombre">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="Nombre del estudiante o docente"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="correo">
            Correo
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
            placeholder="Minimo 6 caracteres"
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
          {isLoading ? "Registrando usuario..." : "Crear cuenta"}
        </button>

        <Link
          href="/login"
          className="block text-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          Volver al login
        </Link>
      </form>
    </AuthCard>
  );
}
