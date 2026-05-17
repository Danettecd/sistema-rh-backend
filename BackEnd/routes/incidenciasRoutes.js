const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');

const router = express.Router();

const {
  getIncidencias,
  getIncidenciaById,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia,
  getIncidenciasByEmpleado

} = require('../controllers/incidenciasController');

router.get(
  '/',
  authenticateToken,
  getIncidencias
);

router.get(
  '/:id',
  authenticateToken,
  getIncidenciaById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createIncidencia
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateIncidencia
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteIncidencia
);


module.exports = router;