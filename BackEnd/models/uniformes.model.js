const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');

const Uniforme = sequelize.define('Uniforme', {

  tipo: {
    type: DataTypes.ENUM('Uniforme', 'Calzado', 'EPP'),
    allowNull: false
  },

  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fecha_entrega: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  talla: {
    type: DataTypes.STRING
  },

  color: {
    type: DataTypes.STRING
  },

  observaciones: {
    type: DataTypes.STRING
  }

});

Uniforme.belongsTo(Empleado, {
  foreignKey: 'empleado_id'
});

Empleado.hasMany(Uniforme, {
  foreignKey: 'empleado_id'
});

module.exports = Uniforme;