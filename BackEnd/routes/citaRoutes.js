const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');
const router = express.Router();

const {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
} = require('../controllers/citaController');

router.get(
  '/',
  authenticateToken,
  getCitas
);

router.get(
  '/:id',
  authenticateToken,
  getCitaById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createCita
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateCita
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteCita
);

module.exports = router;