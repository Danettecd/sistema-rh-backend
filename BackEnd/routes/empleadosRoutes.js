const { 
   authenticateToken,
   authorizeRoles
} = require('../middleware/auth');

const express = require("express");

const router = express.Router();

const { 
  obtenerEmpleados, 
  crearEmpleado, 
  obtenerEmpleadoPorId, 
  actualizarEmpleado,
  eliminarEmpleado 
} = require("../controllers/empleadosController");

router.get(
   "/",
   authenticateToken,
   obtenerEmpleados
);

router.post(
   "/",
   authenticateToken,
   authorizeRoles(
      'admin',
      'contadora',
      'auxiliar'
   ),
   crearEmpleado
);

router.get(
   "/:id",
   authenticateToken,
   obtenerEmpleadoPorId
);

router.put(
   "/:id",
   authenticateToken,
   authorizeRoles(
      'admin',
      'contadora',
      'auxiliar'
   ),
   actualizarEmpleado
);

router.delete(
   "/:id",
   authenticateToken,
   authorizeRoles(
      'admin',
      'contadora'
   ),
   eliminarEmpleado
);

module.exports = router;