# RH SIGPA

Sistema RH SIGPA con backend Node.js + Express + Sequelize + MySQL, frontend React + Vite, Swagger, pruebas base y un microservicio independiente de notificaciones.

## Requisitos

- Node.js 20 o compatible
- npm
- MySQL local para desarrollo sin Docker
- Docker Desktop o Docker Engine con Docker Compose para ejecución en contenedores

## Puertos

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Notifications service: `http://localhost:4001`
- MySQL: `localhost:3306`

## Correr Local

Configura las variables en `BackEnd/.env` tomando como base `BackEnd/.env.example`. No subas el `.env` real.

Instala dependencias del backend desde la raíz:

```bash
npm install
```

Levanta el backend:

```bash
node BackEnd/server.js
```

Instala y levanta el frontend:

```bash
cd FrontEnd/frontend-rh
npm install
npm run dev
```

## Swagger

Con el backend corriendo, abre:

```text
http://localhost:3000/api-docs
```

Swagger documenta login, empleados, vehiculos, incidencias, asistencia, uniformes y salud. Los endpoints protegidos usan Bearer JWT.

## Tests

Desde la raíz:

```bash
npm test
```

Las pruebas con token usan `TEST_EMAIL` y `TEST_PASSWORD`. Si no existen en `BackEnd/.env`, esas pruebas quedan pendientes para no crear, borrar ni modificar datos reales.

## Docker

Levanta MySQL, backend, frontend y notifications-service:

```bash
docker compose up --build
```

Detén los servicios:

```bash
docker compose down
```

Para eliminar también volúmenes de MySQL y uploads:

```bash
docker compose down -v
```

El backend en Docker usa estas variables declaradas en `docker-compose.yml`:

- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=example_password`
- `DB_NAME=practica5`
- `JWT_SECRET=docker_secret_key`
- `NODE_ENV=development`
- `PORT=3000`

Docker es adicional al flujo local; no reemplaza `node BackEnd/server.js`.

## Notifications Service

`services/notifications-service` es un microservicio independiente de notificaciones RH. No depende todavía de MySQL ni del backend principal.

Endpoints:

```text
GET http://localhost:4001/health
GET http://localhost:4001/notifications/birthdays
GET http://localhost:4001/notifications/documents
```

Respuesta de salud esperada:

```json
{
  "status": "ok",
  "service": "notifications-service"
}
```

## Arquitectura

`docker-compose.yml` levanta cuatro servicios:

- `mysql`: base de datos MySQL con volumen persistente `mysql_data`.
- `backend`: API SIGPA en Express, puerto `3000`, con volumen `backend_uploads` para archivos subidos.
- `frontend`: app React + Vite, puerto `5173`.
- `notifications-service`: microservicio Express separado, puerto `4001`.
