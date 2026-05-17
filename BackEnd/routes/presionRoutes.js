const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const express = require('express');
const router = express.Router();

const {
  getPresiones,
  getPresionById,
  createPresion,
  updatePresion,
  deletePresion
} = require('../controllers/presionController');

router.get(
  '/',
  authenticateToken,
  getPresiones
);

router.get(
  '/:id',
  authenticateToken,
  getPresionById
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createPresion
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updatePresion
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deletePresion
);


module.exports = router;