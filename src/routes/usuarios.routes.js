// src/routes/usuarios.routes.js
const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const {
  list,
  getById,
  create,
  update,
  deleteUser,
  updateRole
} = require('../controllers/usuarios.controller');

const router = Router();

// Todas las rutas requieren autenticación Y ser admin
router.get('/', verifyToken, isAdmin, list);
router.get('/:id', verifyToken, isAdmin, getById);
router.post('/', verifyToken, isAdmin, create);
router.put('/:id', verifyToken, isAdmin, update);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.put('/:id/rol', verifyToken, isAdmin, updateRole);

module.exports = router;