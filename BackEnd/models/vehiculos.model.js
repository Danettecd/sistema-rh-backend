const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehiculo = sequelize.define('Vehiculo', {

  numeroVehiculo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fotoVehiculo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  color: {
    type: DataTypes.STRING
  },

  placas: {
    type: DataTypes.STRING,
    allowNull: false
  },

  numeroSerie: {
    type: DataTypes.STRING,
    allowNull: true
  },

  numeroMotor: {
    type: DataTypes.STRING,
    allowNull: true
  },

  numeroTarjetaCirculacion: {
    type: DataTypes.STRING
  },

 fechaExpedicionTarjeta: {
  type: DataTypes.DATEONLY
},

  aseguradora: {
    type: DataTypes.STRING
  },

  numeroPoliza: {
    type: DataTypes.STRING
  },

  vigenciaPoliza: {
    type: DataTypes.DATEONLY
  }

}, {
  tableName: 'vehiculos',
  timestamps: true
});

module.exports = Vehiculo;
