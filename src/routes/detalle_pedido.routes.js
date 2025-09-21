const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const { listarPorPedido } = require('../controllers/detalle_pedido.controller.js');


const router = Router();
router.get('/:pedidoId', verifyToken, listarPorPedido);
module.exports = router;
