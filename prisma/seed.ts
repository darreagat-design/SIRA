import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const espacios = [
  {
    nombre: "Salon A-101",
    tipo: "Salon",
    ubicacion: "Edificio A, primer nivel",
    capacidad: 35,
    descripcion: "Salon para clases teoricas y sesiones grupales.",
    activo: true,
  },
  {
    nombre: "Laboratorio L-204",
    tipo: "Laboratorio",
    ubicacion: "Edificio B, segundo nivel",
    capacidad: 28,
    descripcion: "Laboratorio equipado para practicas de computacion.",
    activo: true,
  },
  {
    nombre: "Auditorio Central",
    tipo: "Auditorio",
    ubicacion: "Edificio Administrativo",
    capacidad: 180,
    descripcion: "Auditorio para conferencias, charlas y eventos institucionales.",
    activo: true,
  },
  {
    nombre: "Salon C-303",
    tipo: "Salon",
    ubicacion: "Edificio C, tercer nivel",
    capacidad: 45,
    descripcion: "Salon amplio para grupos de tamano medio.",
    activo: true,
  },
  {
    nombre: "Laboratorio de Electronica",
    tipo: "Laboratorio",
    ubicacion: "Edificio D, primer nivel",
    capacidad: 22,
    descripcion: "Espacio para practicas de circuitos y medicion electronica.",
    activo: true,
  },
];

async function main() {
  for (const espacio of espacios) {
    const existente = await prisma.espacio.findFirst({
      where: {
        nombre: espacio.nombre,
        ubicacion: espacio.ubicacion,
      },
    });

    if (existente) {
      await prisma.espacio.update({
        where: { id: existente.id },
        data: espacio,
      });

      continue;
    }

    await prisma.espacio.create({
      data: espacio,
    });
  }

  console.log(`Seed completado: ${espacios.length} espacios academicos procesados.`);
}

main()
  .catch((error) => {
    console.error("Error ejecutando el seed de Prisma:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
