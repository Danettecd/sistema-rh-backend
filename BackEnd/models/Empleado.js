const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Empleado = sequelize.define('Empleado', {

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  puesto: {
    type: DataTypes.STRING
  },

  telefono: {
    type: DataTypes.STRING
  },

  direccion: {
    type: DataTypes.STRING
  },

  email: {
    type: DataTypes.STRING
  },

  rfc: {
    type: DataTypes.STRING
  },

  curp: {
    type: DataTypes.STRING
  },

  nss: {
    type: DataTypes.STRING
  },

  fechaIngreso: {
    type: DataTypes.DATEONLY
  },

  fechaNacimiento: {
    type: DataTypes.DATEONLY
  },

  foto: {
    type: DataTypes.STRING
  }

}, {

  tableName: 'empleados',

  timestamps: false

});

module.exports = Empleado;
