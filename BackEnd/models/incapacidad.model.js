const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Incapacidad = sequelize.define('Incapacidad', {

  fecha_inicio: {
    type: DataTypes.DATEONLY
  },

  fecha_fin: {
    type: DataTypes.DATEONLY
  },

  motivo: {
    type: DataTypes.TEXT
  }

});

Empleado.hasMany(Incapacidad, {
  foreignKey: 'empleado_id'
});

Incapacidad.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

module.exports = Incapacidad;