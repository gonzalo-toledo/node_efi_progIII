const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole.js');

const {
    listar,
    crear,
    cambiarEstado,
    eliminar,
} = require('../controllers/pedidos.controller');

const router = Router();
router.post('/',     verifyToken, checkRole('mesero','admin'), crear);
router.get('/',      verifyToken, listar);
router.put('/:id',   verifyToken, checkRole('cocinero','mesero','admin'), cambiarEstado);
router.delete('/:id',verifyToken, checkRole('admin'), eliminar);
module.exports = router;
