const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Cita = sequelize.define('Cita', {

  fecha: {
    type: DataTypes.DATEONLY
  },

  hora: {
  type: DataTypes.TIME
},

  especialidad: {
    type: DataTypes.STRING
  },

  comentarios: {
    type: DataTypes.TEXT
  }

});

Empleado.hasMany(Cita, {
  foreignKey: 'empleado_id'
});

Cita.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

module.exports = Cita;