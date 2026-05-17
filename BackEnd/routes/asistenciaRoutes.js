const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');

const router = express.Router();

const {
  getAsistencias,
  getAsistenciaById,
  getAsistenciaByEmpleado,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
} = require('../controllers/asistenciaController');


// GET TODAS
router.get(
  '/',
  authenticateToken,
  getAsistencias
);


// GET POR EMPLEADO
router.get(
  '/empleado/:employeeId',
  authenticateToken,
  getAsistenciaByEmpleado
);


// GET POR ID
router.get(
  '/:id',
  authenticateToken,
  getAsistenciaById
);


// POST
router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createAsistencia
);


// PUT
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateAsistencia
);



router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteAsistencia
);

module.exports = router;