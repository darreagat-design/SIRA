# SIRA - Sprint 1

Base tecnica inicial de SIRA (Sistema Inteligente de Reservas Academicas).

Este sprint solo prepara el entorno de desarrollo con Next.js, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL y Docker Compose. No incluye entidades finales del negocio, autenticacion, endpoints funcionales ni pantallas completas.

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
|  |- schema.prisma
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

2. Crea tu archivo de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

3. Levanta PostgreSQL con Docker Compose:

```bash
docker compose up -d
```

4. Verifica la configuracion de Prisma y genera el cliente:

```bash
npx prisma validate
npx prisma generate
```

5. Inicia el proyecto en desarrollo:

```bash
npm run dev
```

## Notas del Sprint 1

- `prisma/schema.prisma` solo deja configurada la conexion a PostgreSQL.
- Las entidades `Usuario`, `Espacio` y `Reserva` se modelaran en el siguiente sprint.
- `src/lib/prisma.ts` centraliza la instancia reusable de Prisma Client.
- `docker-compose.yml` solo levanta PostgreSQL para desarrollo local.
