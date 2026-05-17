const authRoutes = require('./routes/authRoutes');

const app = require('./app');

const sequelize = require('./config/db');

const Empleado = require('./models/Empleado');
const Asistencia = require('./models/asistencia.model');
const Incidencia = require('./models/incidencias.model');
const uniformesRoutes = require('./routes/uniformesRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const saludRoutes = require('./routes/saludRoutes');
const presionRoutes = require('./routes/presionRoutes');
const incapacidadRoutes = require('./routes/incapacidadRoutes');
const citaRoutes = require('./routes/citaRoutes');

const User = require('./models/User');

app.use('/salud', saludRoutes);
app.use('/presiones', presionRoutes);
app.use('/incapacidades', incapacidadRoutes);
app.use('/citas', citaRoutes);
app.use(uniformesRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/api', authRoutes);

// RELACIONES

Empleado.hasMany(Asistencia, {
  foreignKey: 'employeeId'
});

Asistencia.belongsTo(Empleado, {
  foreignKey: 'employeeId'
});

Empleado.hasMany(Incidencia, {
  foreignKey: 'empleado_id'
});

Incidencia.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

require('./models/Empleado');
require('./models/salud.model');
require('./models/presion.model');
require('./models/incapacidad.model');
require('./models/cita.model');

// BASE DE DATOS
sequelize.sync({ alter: true })
  .then(() => {

    console.log('Base sincronizada');

    app.listen(3000, () => {
      console.log('Servidor corriendo');
    });

  })
  .catch(error => {
    console.log(error);
  });
