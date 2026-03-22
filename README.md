# SIRA - Sprint 4

Interfaz web minima del MVP de SIRA (Sistema Inteligente de Reservas Academicas).

Este sprint incorpora las pantallas de login, registro, dashboard y reserva, todas conectadas con la API construida en el sprint anterior. La sesion se maneja de forma simple con `sessionStorage`, sin JWT, cookies ni middleware avanzado.

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

5. Carga el seed de espacios academicos:

```bash
npx prisma db seed
```

6. Inicia el proyecto:

```bash
npm run dev
```

## Flujo basico del Sprint 4

1. Entra a `/register` y crea un usuario.
2. Ve a `/login` e inicia sesion.
3. Al entrar, se guardan los datos basicos del usuario en `sessionStorage`.
4. En `/dashboard` veras el panel principal y los espacios activos.
5. En `/reserva` puedes consultar disponibilidad y crear una reserva.

## Pantallas disponibles

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/reserva`

## Endpoints usados por la UI

- `POST /api/usuarios/register`
- `POST /api/auth/login`
- `GET /api/espacios`
- `GET /api/disponibilidad`
- `POST /api/reservas`

## Notas

- La UI hace una verificacion simple del lado cliente para redirigir a `/login` si no hay usuario en `sessionStorage`.
- El contenedor PostgreSQL usa el puerto `5433` para evitar conflictos con instalaciones locales en `5432`.
- Este sprint deja el proyecto listo para pruebas finales y pulido, sin avanzar al Sprint 5.
