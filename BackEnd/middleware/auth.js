const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sigpa-secret-key';

function generateAccessToken(user) {

   return jwt.sign(

      {
         id: user.id,
         role: user.role,
         email: user.email
      },

      SECRET_KEY,

      { expiresIn: '1h' }

   );
}

function authenticateToken(req, res, next) {

   const authHeader = req.headers['authorization'];

   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {

   return res.status(401).json({
      message: 'Token requerido'
   });

}

   jwt.verify(token, SECRET_KEY, (err, user) => {

     if (err) {

   return res.status(403).json({
      message: 'Token inválido o expirado'
   });

}
      req.user = user;
console.log('Usuario autenticado:', req.user);
      next();

   });
}

function authorizeRoles(...roles) {

   return (req, res, next) => {

      console.log('Roles permitidos:', roles);

      console.log('Role usuario:', req.user.role);

      if (!roles.includes(req.user.role)) {

         return res.status(403).json({
            message: 'Acceso denegado'
         });

      }

      next();

   };
}

module.exports = {
   generateAccessToken,
   authenticateToken,
   authorizeRoles
};