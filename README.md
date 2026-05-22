# SIGPA RH 💙

Sistema integral de Recursos Humanos desarrollado con tecnologías modernas para la administración de empleados, incidencias, asistencia, salud ocupacional, vehículos y uniformes.

---

# 🚀 Tecnologías utilizadas

## Frontend

* React
* Vite
* Axios
* CSS Responsive

## Backend

* Node.js
* Express
* Sequelize
* JWT Authentication
* Helmet
* Multer
* dotenv

## Base de datos

* MySQL

## Documentación y pruebas

* Swagger / OpenAPI
* Mocha
* Chai

## DevOps

* Docker
* Docker Compose

## Arquitectura

* Microservicios
* Notifications Service

---

# ✨ Funcionalidades principales

## 🔐 Autenticación y seguridad

* Login con JWT
* Roles y permisos (4)
* Middleware de autenticación
* Helmet para seguridad HTTP
* Variables de entorno con dotenv

## 👥 Gestión de empleados

* Alta de empleados
* Edición de empleados
* Eliminación de empleados
* Fotografía de empleados
* Validaciones backend

## 📊 Dashboard RH

* Estadísticas generales
* Gráficas dinámicas
* Cumpleaños del mes
* Incidencias y asistencia

## 🚗 Vehículos

* Registro de vehículos
* Pólizas
* Tarjetas de circulación
* Fotografías

## 🩺 Salud ocupacional

* Expedientes médicos
* Presión arterial
* Incapacidades
* Citas médicas

## 👕 Uniformes y EPP

* Registro de entregas
* Historial por empleado

## 📄 API Documentation

* Swagger UI integrado

## 🧪 Testing

* Mocha + Chai
* Pruebas de integración básicas

## 🐳 Docker

* Backend container
* Frontend container
* MySQL container
* Notifications microservice

---

# 📁 Estructura general

ProyectoFinalBN/
│
├── BackEnd/
├── FrontEnd/
├── services/
│   └── notifications-service/
├── docker-compose.yml
└── README.md

---

# ⚙️ Variables de entorno

Crear archivo:

BackEnd/.env

Ejemplo:

PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=practica5

JWT_SECRET=sigpa-secret-key

NODE_ENV=development

---

# ▶️ Ejecución local

## Backend

Desde la raíz:

cd BackEnd
npm install
node server.js

Backend:
http://localhost:3000

---

## Frontend

cd FrontEnd/frontend-rh
npm install
npm run dev

Frontend:
http://localhost:5173

---

# 📚 Swagger

Documentación API:

http://localhost:3000/api-docs

Incluye:

* Login
* Empleados
* Vehículos
* Incidencias
* Asistencia
* Uniformes
* Salud

---

# 🧪 Ejecutar pruebas

Desde raíz:

npm test

Resultado esperado:

2 passing
4 pending

Las pruebas protegidas requieren:

TEST_EMAIL=
TEST_PASSWORD=

en BackEnd/.env

---

# 🐳 Docker

## Levantar contenedores

Desde raíz:

docker compose up --build

## Apagar contenedores

docker compose down

---

# 🐳 Servicios Docker

| Servicio              | Puerto        |
| --------------------- | ------------- |
| Frontend              | 5173          |
| Backend               | 3000          |
| Swagger               | 3000/api-docs |
| Notifications Service | 4001          |
| MySQL Docker          | 3307          |

---

# 🔔 Microservicio Notifications Service

Servicio independiente de notificaciones RH.

## Endpoints

### Health Check

http://localhost:4001/health

### Cumpleaños

http://localhost:4001/notifications/birthdays

### Documentos

http://localhost:4001/notifications/documents

---

# 🔐 Usuario administrador Docker

Usuario inicial para entorno Docker:

Email:
[admin@sigpa.local](mailto:admin@sigpa.local)

Password:
admin123

Nota:
Docker utiliza una base de datos independiente del entorno local.

---

# 🧠 Arquitectura

SIGPA RH utiliza una arquitectura modular basada en:

* Frontend React + Vite
* Backend Express + Sequelize
* MySQL
* Microservicio independiente
* Docker Compose
* API REST

---

# 📌 Características técnicas implementadas

✅ JWT Authentication
✅ Roles y permisos
✅ Middleware de seguridad Helmet
✅ Variables de entorno dotenv
✅ Uploads con Multer
✅ Validaciones backend
✅ Swagger/OpenAPI
✅ Testing con Mocha/Chai
✅ Docker Compose
✅ Microservicios
✅ Responsive Design
✅ CRUD completo
✅ Arquitectura modular

---

# 👩‍💻 Proyecto académico

Proyecto desarrollado como sistema integral de Recursos Humanos enfocado en:

* arquitectura backend moderna
* seguridad
* documentación API
* pruebas
* contenedores Docker
* microservicios
* experiencia de usuario

---
