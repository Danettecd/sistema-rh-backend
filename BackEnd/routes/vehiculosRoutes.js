const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');
const uploadVehiculo = require('../middleware/uploadVehiculo');
const router = express.Router();

const {
  getVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} = require('../controllers/vehiculosController');


router.get(
  '/',
  authenticateToken,
  getVehiculos
);

router.get(
  '/:id',
  authenticateToken,
  getVehiculoById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  uploadVehiculo.single('fotoVehiculo'),
  createVehiculo
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  uploadVehiculo.single('fotoVehiculo'),
  updateVehiculo
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteVehiculo
);


module.exports = router;
