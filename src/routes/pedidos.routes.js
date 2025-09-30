const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole.js');

const {
    listar,
    crear,
    actualizarEstado,
    cancelar,
} = require('../controllers/pedidos.controller');

const router = Router();
router.post('/',     verifyToken, checkRole('mesero','admin'), crear);
router.get('/', listar);
router.put('/:id',   verifyToken, checkRole('cocinero','mesero','admin'), actualizarEstado);
router.put('/:id',verifyToken, checkRole('admin'), cancelar);
module.exports = router;
