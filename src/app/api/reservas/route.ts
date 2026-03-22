import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  buildConflictWhere,
  createReservaSchema,
  formatZodError,
  parseDateOnly,
} from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "El cuerpo de la solicitud no contiene un JSON valido.",
      },
      { status: 400 },
    );
  }

  const parsedBody = createReservaSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Los datos enviados no son validos.",
        errors: formatZodError(parsedBody.error),
      },
      { status: 400 },
    );
  }

  const { usuarioId, espacioId, fecha, horaInicio, horaFin, motivo } = parsedBody.data;

  try {
    const [usuario, espacio] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: {
          id: true,
        },
      }),
      prisma.espacio.findUnique({
        where: { id: espacioId },
        select: {
          id: true,
          activo: true,
          nombre: true,
        },
      }),
    ]);

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario indicado no existe.",
        },
        { status: 404 },
      );
    }

    if (!espacio) {
      return NextResponse.json(
        {
          ok: false,
          message: "El espacio indicado no existe.",
        },
        { status: 404 },
      );
    }

    if (!espacio.activo) {
      return NextResponse.json(
        {
          ok: false,
          message: "El espacio indicado no esta activo.",
        },
        { status: 400 },
      );
    }

    const conflicto = await prisma.reserva.findFirst({
      where: {
        espacioId,
        ...buildConflictWhere(fecha, horaInicio, horaFin),
      },
      select: {
        id: true,
        horaInicio: true,
        horaFin: true,
      },
    });

    if (conflicto) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una reserva en conflicto para ese espacio y horario.",
        },
        { status: 409 },
      );
    }

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId,
        espacioId,
        fecha: parseDateOnly(fecha),
        horaInicio,
        horaFin,
        motivo,
      },
      select: {
        id: true,
        usuarioId: true,
        espacioId: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        motivo: true,
        estado: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Reserva creada correctamente.",
        data: reserva,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creando reserva:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible crear la reserva.",
      },
      { status: 500 },
    );
  }
}
