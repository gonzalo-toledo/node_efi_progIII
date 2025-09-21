const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole.js');
const {
    listar,
    crear,
    actualizar,
    eliminar,
} = require('../controllers/platos.controller');

const router = Router();
router.get('/',verifyToken, listar);
router.post('/',verifyToken, checkRole('admin'), crear);
router.put('/:id',verifyToken, checkRole('admin'), actualizar);
router.delete('/:id',verifyToken, checkRole('admin'), eliminar);

module.exports = router;
