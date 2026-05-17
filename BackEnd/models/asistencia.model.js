const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asistencia = sequelize.define('Asistencia', {

  type: {
    type: DataTypes.ENUM(
      'falta',
      'retardo',
      'permiso',
      'horas_extra'
    ),
    allowNull: false
  },

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING
  },

  hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
,

employeeId: {
  type: DataTypes.INTEGER,
  allowNull: false
}

});

module.exports = Asistencia;