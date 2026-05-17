const express = require("express");
const app = express();
app.use(express.json());

const empleadosRoutes = require('./routes/empleadosRoutes');
const asistenciaRoutes = require("./routes/asistenciaRoutes");
const saludRoutes = require("./routes/saludRoutes");
const uniformesRoutes = require("./routes/uniformesRoutes");
const vehiculosRoutes = require("./routes/vehiculosRoutes");
const incidenciasRoutes = require('./routes/incidenciasRoutes');


app.use('/empleados', empleadosRoutes);
app.use("/asistencia", asistenciaRoutes);
app.use("/salud", saludRoutes);
app.use("/uniformes", uniformesRoutes);
app.use("/incidencias", incidenciasRoutes);
app.use("/vehiculos", vehiculosRoutes);

console.log("Consultando en la base de datos...");
console.log("SaludRoutes:", saludRoutes);

setTimeout(()=>{
 console.log("Expedientes cargados");
},2000);

console.log("Servidor configurándose");

app.get("/",(req,res)=>{
 res.send("Sistema Global de Personal y Activos");
});

module.exports = app;

