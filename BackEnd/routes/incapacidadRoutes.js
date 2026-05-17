const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');
const router = express.Router();

const {
  getIncapacidades,
  getIncapacidadById,
  createIncapacidad,
  updateIncapacidad,
  deleteIncapacidad
} = require('../controllers/incapacidadController');

router.get(
  '/',
  authenticateToken,
  getIncapacidades  
);

router.get(
  '/:id',
  authenticateToken,
  getIncapacidadById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createIncapacidad
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateIncapacidad
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteIncapacidad
);


module.exports = router;