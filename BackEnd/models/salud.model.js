const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Salud = sequelize.define('Salud', {

  nss: {
    type: DataTypes.STRING,
    allowNull: false
  },

  clinica: {
    type: DataTypes.STRING
  },

  tipo_sangre: {
    type: DataTypes.STRING
  },

  padecimientos: {
    type: DataTypes.TEXT
  },

  contacto_emergencia: {
    type: DataTypes.STRING
  },

  telefono_emergencia: {
    type: DataTypes.STRING
  }

});

Empleado.hasOne(Salud, {
  foreignKey: 'empleado_id'
});

Salud.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

module.exports = Salud;