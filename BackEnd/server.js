require('dotenv').config();
const app = require('./app');

const sequelize = require('./config/db');

const Empleado = require('./models/Empleado');
const Asistencia = require('./models/asistencia.model');
const Incidencia = require('./models/incidencias.model');

const User = require('./models/User');

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

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  })
  .catch(error => {
    console.log(error);
  });
