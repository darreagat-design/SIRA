# SIRA - Sistema Inteligente de Reservas Academicas

Aplicacion web academica para gestionar reservas de salones, laboratorios y auditorios.

## Objetivo academico

SIRA fue desarrollado como proyecto academico para demostrar el ciclo completo de analisis, configuracion tecnica, persistencia, API e interfaz web de un sistema minimo de reservas academicas.

## Stack tecnologico

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Docker Compose
- Zod
- bcrypt

## Requisitos previos

- Node.js 20 o superior
- npm
- Docker Desktop o Docker Engine con Docker Compose

## Variables de entorno necesarias

Crea un archivo `.env` a partir de `.env.example` con estas variables:

```env
POSTGRES_DB=sira_db
POSTGRES_USER=sira_user
POSTGRES_PASSWORD=sira_password
POSTGRES_PORT=5433
DATABASE_URL="postgresql://sira_user:sira_password@localhost:5433/sira_db?schema=public"
```

## Levantar PostgreSQL con Docker Compose

```bash
docker compose up -d
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev
```

## Ejecutar el seed

```bash
npx prisma db seed
```

## Correr el proyecto en desarrollo

```bash
npm run dev
```

Abre la aplicacion en el navegador en:

```text
http://localhost:3001/
```

## Endpoints disponibles

- `POST /api/usuarios/register`
- `POST /api/auth/login`
- `GET /api/espacios`
- `GET /api/disponibilidad`
- `POST /api/reservas`
- `GET /api/mis-reservas?usuarioId=...`

## Flujo basico de uso

1. Registrar un usuario desde `/register`.
2. Iniciar sesion desde `/login`.
3. Entrar al dashboard y revisar espacios activos junto con las reservas registradas del usuario autenticado.
4. Ir a `/reserva`.
5. Consultar disponibilidad por fecha y horario.
6. Crear una reserva valida.
7. Cerrar sesion desde el encabezado.

## Estructura general del proyecto

```text
.
|- docker-compose.yml
|- prisma/
|  |- migrations/
|  |- schema.prisma
|  |- seed.ts
|- src/
|  |- app/
|  |  |- api/
|  |  |- dashboard/
|  |  |- login/
|  |  |- register/
|  |  |- reserva/
|  |- components/
|  |- lib/
|- README.md
```

## Pruebas manuales sugeridas

- Registrar un usuario nuevo desde la UI.
- Intentar registrar un correo repetido.
- Iniciar sesion con credenciales correctas.
- Intentar login con password incorrecta.
- Listar espacios activos en el dashboard.
- Ver reservas registradas del usuario dentro del dashboard.
- Consultar disponibilidad para una fecha y un rango horario.
- Crear una reserva valida.
- Intentar crear una reserva traslapada para verificar el conflicto.
- Verificar que `/dashboard` y `/reserva` redirigen a `/login` cuando no hay usuario en `sessionStorage`.

## Notas finales

- La sesion se maneja de forma simple con `sessionStorage`.
- No se usa JWT, cookies ni middleware complejo.
- PostgreSQL usa el puerto `5433` para evitar conflictos con instalaciones locales en `5432`.
- El proyecto queda listo para pruebas manuales, demostracion y defensa en clase.
