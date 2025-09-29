const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');

const { 
    listarPorPedido,
    agregar,
    editar,
    eliminar
} = require('../controllers/detalle_pedido.controller.js');


const router = Router();
// router.get('/:pedidoId', verifyToken, listarPorPedido);
// router.post('/', verifyToken, agregar);
// router.put('/:id', verifyToken, editar);
// router.delete('/:id', verifyToken, eliminar);



router.get('/:pedidoId', listarPorPedido);
router.post('/', agregar);
router.put('/:id', editar);
router.delete('/:id', eliminar);

module.exports = router;
