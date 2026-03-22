import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  agendaEspacioQuerySchema,
  formatZodError,
  getDateRangeForDay,
} from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsedQuery = agendaEspacioQuerySchema.safeParse({
    espacioId: searchParams.get("espacioId"),
    fecha: searchParams.get("fecha"),
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

  const { espacioId, fecha } = parsedQuery.data;

  try {
    const espacio = await prisma.espacio.findUnique({
      where: {
        id: espacioId,
      },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        ubicacion: true,
        capacidad: true,
        activo: true,
      },
    });

    if (!espacio) {
      return NextResponse.json(
        {
          ok: false,
          message: "El espacio indicado no existe.",
        },
        { status: 404 },
      );
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        espacioId,
        fecha: getDateRangeForDay(fecha),
      },
      orderBy: {
        horaInicio: "asc",
      },
      select: {
        id: true,
        horaInicio: true,
        horaFin: true,
        motivo: true,
        estado: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Agenda del espacio obtenida correctamente.",
      data: {
        espacio,
        fecha,
        reservas,
      },
    });
  } catch (error) {
    console.error("Error consultando agenda del espacio:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible obtener la agenda del espacio.",
      },
      { status: 500 },
    );
  }
}
