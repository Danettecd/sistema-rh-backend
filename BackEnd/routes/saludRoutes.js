const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');
const router = express.Router();

const {
  getSalud,
  getSaludById,
  createSalud,
  updateSalud,
  deleteSalud
} = require('../controllers/saludController');

router.get(
  '/',
  authenticateToken,
  getSalud
);

router.get(
  '/:id',
  authenticateToken,
  getSaludById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createSalud
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateSalud
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteSalud
);


module.exports = router;