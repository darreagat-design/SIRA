import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const nombreSchema = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio.")
  .max(100, "El nombre es demasiado largo.");

const correoSchema = z
  .string()
  .trim()
  .email("El correo no tiene un formato valido.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(6, "La password debe tener al menos 6 caracteres.");

const idSchema = z.string().trim().min(1, "El identificador es obligatorio.");

const fechaSchema = z
  .string()
  .trim()
  .regex(dateRegex, "La fecha debe usar el formato YYYY-MM-DD.")
  .refine((value) => isValidDateOnly(value), "La fecha no es valida.");

const horaSchema = z
  .string()
  .trim()
  .regex(timeRegex, "La hora debe usar el formato HH:mm.");

function withValidTimeRange<T extends { horaInicio: string; horaFin: string }>(
  schema: z.ZodType<T>,
) {
  return schema.superRefine((data, ctx) => {
    if (data.horaInicio >= data.horaFin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["horaFin"],
        message: "La hora de inicio debe ser menor que la hora de fin.",
      });
    }
  });
}

export const registerUserSchema = z.object({
  nombre: nombreSchema,
  correo: correoSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  correo: correoSchema,
  password: z.string().min(1, "La password es obligatoria."),
});

export const disponibilidadSchema = withValidTimeRange(
  z.object({
    fecha: fechaSchema,
    horaInicio: horaSchema,
    horaFin: horaSchema,
  }),
);

export const createReservaSchema = withValidTimeRange(
  z.object({
    usuarioId: idSchema,
    espacioId: idSchema,
    fecha: fechaSchema,
    horaInicio: horaSchema,
    horaFin: horaSchema,
    motivo: z.string().trim().min(1, "El motivo es obligatorio."),
  }),
);

export function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function isValidDateOnly(value: string) {
  const parsed = parseDateOnly(value);
  const [year, month, day] = value.split("-").map(Number);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function getDateRangeForDay(value: string) {
  const start = parseDateOnly(value);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    gte: start,
    lt: end,
  };
}

export function buildConflictWhere(
  fecha: string,
  horaInicio: string,
  horaFin: string,
): Prisma.ReservaWhereInput {
  return {
    fecha: getDateRangeForDay(fecha),
    horaInicio: {
      lt: horaFin,
    },
    horaFin: {
      gt: horaInicio,
    },
  };
}
