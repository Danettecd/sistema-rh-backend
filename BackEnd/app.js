const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

const empleadosRoutes = require('./routes/empleadosRoutes');
const asistenciaRoutes = require("./routes/asistenciaRoutes");
const saludRoutes = require("./routes/saludRoutes");
const presionRoutes = require("./routes/presionRoutes");
const incapacidadRoutes = require("./routes/incapacidadRoutes");
const citaRoutes = require("./routes/citaRoutes");
const uniformesRoutes = require("./routes/uniformesRoutes");
const vehiculosRoutes = require("./routes/vehiculosRoutes");
const incidenciasRoutes = require('./routes/incidenciasRoutes');
const authRoutes = require('./routes/authRoutes');


app.use('/empleados', empleadosRoutes);
app.use("/asistencia", asistenciaRoutes);
app.use("/salud", saludRoutes);
app.use("/presiones", presionRoutes);
app.use("/incapacidades", incapacidadRoutes);
app.use("/citas", citaRoutes);
app.use("/uniformes", uniformesRoutes);
app.use("/incidencias", incidenciasRoutes);
app.use("/vehiculos", vehiculosRoutes);
app.use('/api', authRoutes);

console.log("Consultando en la base de datos...");
console.log("SaludRoutes:", saludRoutes);

setTimeout(()=>{
 console.log("Expedientes cargados");
},2000);

console.log("Servidor configurándose");

app.get("/health",(req,res)=>{
 res.json({
  status: "ok",
  service: "sigpa-backend"
 });
});

app.get("/",(req,res)=>{
 res.send("Sistema Global de Personal y Activos");
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === 'Solo se permiten imagenes') {
    console.error('Error Multer empleados/uploads:', {
      message: error.message,
      code: error.code,
      body: req.body,
      file: req.file
    });

    return res.status(400).json({
      message: error.message || 'Error al cargar archivo'
    });
  }

  next(error);
});

module.exports = app;
