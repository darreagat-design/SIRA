import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { formatZodError, misReservasQuerySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsedQuery = misReservasQuerySchema.safeParse({
    usuarioId: searchParams.get("usuarioId"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Los parametros enviados no son validos.",
        errors: formatZodError(parsedQuery.error),
      },
      { status: 400 },
    );
  }

  const { usuarioId } = parsedQuery.data;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario indicado no existe.",
        },
        { status: 404 },
      );
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId,
      },
      orderBy: [
        { fecha: "desc" },
        { horaInicio: "asc" },
      ],
      select: {
        id: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        motivo: true,
        estado: true,
        espacio: {
          select: {
            id: true,
            nombre: true,
            tipo: true,
            ubicacion: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Reservas del usuario obtenidas correctamente.",
      data: reservas,
    });
  } catch (error) {
    console.error("Error listando reservas del usuario:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible obtener las reservas del usuario.",
      },
      { status: 500 },
    );
  }
}
