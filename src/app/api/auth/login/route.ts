import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { formatZodError, loginSchema } from "@/lib/validations";

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

  const parsedBody = loginSchema.safeParse(body);

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

  const { correo, password } = parsedBody.data;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          message: "Credenciales invalidas.",
        },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          ok: false,
          message: "Credenciales invalidas.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Login correcto.",
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error iniciando sesion:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible validar las credenciales.",
      },
      { status: 500 },
    );
  }
}
