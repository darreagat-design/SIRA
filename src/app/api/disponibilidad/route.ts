import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  buildConflictWhere,
  disponibilidadSchema,
  formatZodError,
} from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsedQuery = disponibilidadSchema.safeParse({
    fecha: searchParams.get("fecha"),
    horaInicio: searchParams.get("horaInicio"),
    horaFin: searchParams.get("horaFin"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Los parametros de consulta no son validos.",
        errors: formatZodError(parsedQuery.error),
      },
      { status: 400 },
    );
  }

  const { fecha, horaInicio, horaFin } = parsedQuery.data;

  try {
    const espaciosDisponibles = await prisma.espacio.findMany({
      where: {
        activo: true,
        reservas: {
          none: buildConflictWhere(fecha, horaInicio, horaFin),
        },
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        ubicacion: true,
        capacidad: true,
        descripcion: true,
        activo: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Disponibilidad consultada correctamente.",
      data: espaciosDisponibles,
    });
  } catch (error) {
    console.error("Error consultando disponibilidad:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible consultar la disponibilidad.",
      },
      { status: 500 },
    );
  }
}
