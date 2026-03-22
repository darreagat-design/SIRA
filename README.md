# SIRA - Sistema Inteligente de Reservas Académicas

Aplicación web académica para gestionar reservas de salones, laboratorios y auditorios.

## Objetivo académico

SIRA fue desarrollado como proyecto académico para demostrar el ciclo completo de análisis, configuración técnica, persistencia, API e interfaz web de un sistema mínimo de reservas académicas.

## Funcionalidades implementadas

- Registro de usuarios
- Inicio de sesión
- Listado de espacios activos
- Consulta de disponibilidad por fecha y rango horario
- Creación de reservas
- Validación de traslape de horarios
- Visualización de reservas registradas del usuario
- Agenda diaria por espacio y fecha

## Stack tecnológico

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

## Puertos utilizados

- Aplicación web: `http://localhost:3001`
- PostgreSQL: `5433`

## Pasos para ejecutar el proyecto

1. Levantar PostgreSQL con Docker Compose:

   ```bash
   docker compose up -d
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar migraciones de Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Ejecutar el seed:

   ```bash
   npx prisma db seed
   ```

5. Iniciar la aplicación en modo desarrollo:

   ```bash
   npm run dev
   ```

6. Abrir la aplicación en el navegador en:

   ```text
   http://localhost:3001/
   ```

## Endpoints disponibles

- `POST /api/usuarios/register` - registrar un nuevo usuario
- `POST /api/auth/login` - validar credenciales de acceso
- `GET /api/espacios` - listar espacios activos
- `GET /api/disponibilidad` - consultar disponibilidad por fecha y horario
- `POST /api/reservas` - crear una nueva reserva
- `GET /api/mis-reservas?usuarioId=...` - listar reservas del usuario autenticado
- `GET /api/agenda-espacio?espacioId=...&fecha=...` - visualizar agenda diaria de un espacio

## Flujo básico de uso

1. Registrar un usuario desde `/register`.
2. Iniciar sesión desde `/login`.
3. Entrar al dashboard y revisar espacios activos junto con las reservas registradas del usuario autenticado.
4. Ir a `/reserva`.
5. Seleccionar espacio y fecha para ver la agenda diaria con horarios ya ocupados.
6. Consultar disponibilidad para el rango horario deseado.
7. Crear una reserva válida.
8. Cerrar sesión desde el encabezado.

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
- Iniciar sesión con credenciales correctas.
- Intentar login con contraseña incorrecta.
- Listar espacios activos en el dashboard.
- Ver reservas registradas del usuario dentro del dashboard.
- Visualizar la agenda diaria de un espacio en la pantalla de reserva.
- Consultar disponibilidad para una fecha y un rango horario.
- Crear una reserva válida.
- Intentar crear una reserva traslapada para verificar el conflicto.
- Verificar que `/dashboard` y `/reserva` redirigen a `/login` cuando no hay usuario en `sessionStorage`.

## Consideraciones técnicas

- La sesión se maneja de forma simple con `sessionStorage`.
- No se usa JWT, cookies ni middleware complejo.
- PostgreSQL usa el puerto `5433` para evitar conflictos con instalaciones locales en `5432`.
- El proyecto está orientado a pruebas manuales, demostración académica y defensa en clase.