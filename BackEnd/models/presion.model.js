const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Presion = sequelize.define('Presion', {

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  presion: {
    type: DataTypes.STRING
  },

  observaciones: {
    type: DataTypes.TEXT
  }

});

Empleado.hasMany(Presion, {
  foreignKey: 'empleado_id'
});

Presion.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

module.exports = Presion;