# SIRA - Sprint 2

Base tecnica y capa de persistencia inicial de SIRA (Sistema Inteligente de Reservas Academicas).

Este sprint deja modeladas las entidades principales del sistema con Prisma, la migracion inicial de base de datos y un seed con espacios academicos de ejemplo. No incluye endpoints funcionales, autenticacion ni pantallas de negocio.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Docker Compose

## Estructura base

```text
.
|- docker-compose.yml
|- .env.example
|- prisma/
|  |- migrations/
|  |- schema.prisma
|  |- seed.ts
|- src/
|  |- app/
|  |- components/
|  |- lib/
|     |- prisma.ts
```

## Levantar el entorno local

1. Instala las dependencias:

```bash
npm install
```

2. Crea tu archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Levanta PostgreSQL con Docker Compose:

```bash
docker compose up -d
```

4. Valida Prisma y genera el cliente:

```bash
npx prisma validate
npx prisma generate
```

5. Crea o aplica la migracion inicial:

```bash
npx prisma migrate dev --name init
```

6. Ejecuta el seed de espacios academicos:

```bash
npx prisma db seed
```

Tambien puedes usar el script:

```bash
npm run db:seed
```

7. Inicia el proyecto en desarrollo:

```bash
npm run dev
```

## Modelos incluidos en Sprint 2

- `Usuario`
- `Espacio`
- `Reserva`

## Notas del Sprint 2

- `correo` en `Usuario` es unico.
- `Espacio.activo` se modela como booleano.
- `Reserva.estado` tiene valor por defecto `confirmada`.
- `horaInicio` y `horaFin` se mantienen como `String` para este MVP.
- El ejemplo usa el puerto `5433` para evitar conflictos con instalaciones locales de PostgreSQL en `5432`.
- El seed crea espacios de ejemplo y deja la base lista para construir la API en el siguiente sprint.
