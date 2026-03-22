# SIRA - Sprint 3

API base del MVP de SIRA (Sistema Inteligente de Reservas Academicas).

Este sprint incorpora endpoints con Next.js App Router para registro de usuarios, login, consulta de espacios activos, consulta de disponibilidad y creacion de reservas. La validacion se realiza con Zod y las contrasenas se almacenan con hash usando bcrypt. No incluye JWT, cookies, middleware de autenticacion ni pantallas funcionales completas.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Docker Compose
- Zod
- bcrypt

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

3. Levanta PostgreSQL:

```bash
docker compose up -d
```

4. Ejecuta migraciones:

```bash
npx prisma migrate dev
```

5. Genera Prisma Client:

```bash
npx prisma generate
```

6. Carga el seed de espacios academicos:

```bash
npx prisma db seed
```

7. Inicia el proyecto:

```bash
npm run dev
```

## Endpoints disponibles en Sprint 3

- `POST /api/usuarios/register`
- `POST /api/auth/login`
- `GET /api/espacios`
- `GET /api/disponibilidad?fecha=2026-03-25&horaInicio=09:00&horaFin=11:00`
- `POST /api/reservas`

## Notas

- La API espera horas en formato `HH:mm`.
- La fecha para disponibilidad y reservas usa el formato `YYYY-MM-DD`.
- El contenedor PostgreSQL usa el puerto `5433` para evitar conflictos con instalaciones locales en `5432`.
- Este sprint deja la base lista para construir la interfaz en el Sprint 4.
