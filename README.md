# SIRA - Sistema Inteligente de Reservas Académicas

SIRA es una aplicación web mínima para la gestión de reservas de espacios académicos, como salones, laboratorios y auditorios.

El objetivo del proyecto es permitir el registro de usuarios, la consulta de disponibilidad y la creación de reservas, evitando conflictos de horario y mejorando la organización de los espacios dentro de una institución educativa.

## Objetivo académico

Este proyecto fue desarrollado como parte de una tarea de diseño y construcción del núcleo de un sistema de reservas académicas, cubriendo análisis, diseño e implementación técnica inicial.

## Alcance del MVP

La primera versión del sistema incluirá:

- Registro de usuarios
- Inicio de sesión básico
- Consulta de espacios
- Consulta de disponibilidad por fecha y horario
- Creación de reservas
- Validación para evitar doble reserva
- Interfaz web mínima con pantallas de login, dashboard y reserva

## Stack tecnológico

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Docker Compose

## Entidades principales

- Usuario
- Espacio
- Reserva

## Endpoints planeados

- `POST /api/usuarios/register`
- `POST /api/auth/login`
- `GET /api/espacios`
- `GET /api/disponibilidad`
- `POST /api/reservas`

## Reglas principales del negocio

- Un usuario debe estar registrado para reservar.
- Un espacio no puede reservarse dos veces en horarios traslapados el mismo día.
- La hora de inicio debe ser menor que la hora de fin.
- No se pueden crear reservas sobre espacios inactivos.

## Estructura del trabajo por sprints

### Sprint 0
- Análisis del problema
- Requerimientos funcionales y no funcionales
- Preguntas al cliente
- Wireframes
- Modelo de datos
- Planeación técnica
- Backlog de sprints

### Sprint 1
- Scaffold del proyecto con Next.js
- Configuración de Prisma
- Configuración de PostgreSQL con Docker Compose
- Variables de entorno iniciales
- Conexión base a la BD

### Sprint 2
- Modelado de entidades en Prisma
- Migraciones
- Seed de espacios iniciales

### Sprint 3
- Implementación de API
- Registro
- Login
- Consulta de espacios
- Disponibilidad
- Creación de reservas

### Sprint 4
- Construcción de interfaz
- Login
- Dashboard
- Reserva

### Sprint 5
- Pulido final
- Documentación
- Validación del flujo completo
- Preparación para entrega

## Estado actual

Proyecto en fase de planeación y configuración inicial.

## Autor

Proyecto académico desarrollado para la construcción de un software mínimo de reservas académicas.