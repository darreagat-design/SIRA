import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { formatZodError, registerUserSchema } from "@/lib/validations";

const SALT_ROUNDS = 10;

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

  const parsedBody = registerUserSchema.safeParse(body);

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

  const { nombre, correo, password } = parsedBody.data;

  try {
    const existingUser = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un usuario registrado con ese correo.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        passwordHash,
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Usuario registrado correctamente.",
        data: usuario,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registrando usuario:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No fue posible registrar el usuario.",
      },
      { status: 500 },
    );
  }
}
