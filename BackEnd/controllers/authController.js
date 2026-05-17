const bcrypt = require('bcryptjs');

const User = require('../models/User');

const { generateAccessToken } = require('../middleware/auth');

exports.login = async (req, res) => {

   try {

      const { email, password } = req.body;

      const user = await User.findOne({
         where: { email }
      });

      if (!user) {

         return res.status(404).json({
            message: 'Usuario no encontrado'
         });

      }

      const validPassword = await bcrypt.compare(
         password,
         user.password
      );

      if (!validPassword) {

         return res.status(401).json({
            message: 'Contraseña incorrecta'
         });

      }

      const token = generateAccessToken(user);

      res.json({
         token
      });

   } catch (error) {

      console.error(error);

      res.status(500).json({
         message: 'Error del servidor'
      });

   }
};