const bcrypt = require('bcryptjs');

const sequelize = require('../config/db');

const User = require('../models/User');

async function createUsers() {

   try {

      await sequelize.sync();

      const hashedPassword = await bcrypt.hash('123456', 10);

      await User.create({
         nombre: 'Danette',
         email: 'admin@sigpa.com',
         password: hashedPassword,
         role: 'admin'
      });

      console.log('Usuario creado correctamente');

   } catch (error) {

      console.error(error);
      

   } finally {

      process.exit();

   }
}

createUsers();