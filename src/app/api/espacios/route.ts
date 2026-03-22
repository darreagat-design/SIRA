import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const espacios = await prisma.espacio.findMany({
      where: {
        activo: true,
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
      message: "Espacios activos obtenidos correctamente.",
      data: espacios,
    });
  } catch (error) {
    console.error("Error listando espacios:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible obtener los espacios activos.",
      },
      { status: 500 },
    );
  }
}
