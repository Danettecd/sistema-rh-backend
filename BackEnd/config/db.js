const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'practica5', // nombre BD
  'root',   // usuario mysql
  'Wisconsin#815', // password mysql
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;