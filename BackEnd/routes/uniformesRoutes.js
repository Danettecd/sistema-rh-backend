const {
  authenticateToken,
  authorizeRoles
} = require('../middleware/auth');

const { Router } = require('express');

const {
  getUniformes,
  getUniforme,
  createUniforme,
  updateUniforme,
  deleteUniforme,
  getUniformesPorEmpleado
} = require('../controllers/uniformesController');

const router = Router();

router.get(
  '/',
  authenticateToken,
  getUniformes
);

router.get(
  '/empleado/:id',
  authenticateToken,
  getUniformesPorEmpleado
);

router.get(
  '/:id',
  authenticateToken,
  getUniforme
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  createUniforme
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora',
    'auxiliar'
  ),
  updateUniforme
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'admin',
    'contadora'
  ),
  deleteUniforme
);


module.exports = router;