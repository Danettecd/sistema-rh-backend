const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Incidencia = sequelize.define('Incidencia', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

Incidencia.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

Empleado.hasMany(Incidencia, {
  foreignKey: 'empleado_id'
});

module.exports = Incidencia;