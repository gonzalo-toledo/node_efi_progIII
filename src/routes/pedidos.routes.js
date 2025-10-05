const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole.js');

const {
    listar,
    listarPorId,
    crear,
    actualizarEstado,
    cancelar,
    actualizarMesa,
    actualizarDetalles,
    cerrar
} = require('../controllers/pedidos.controller');

const router = Router();

// Crear pedido → mesero o admin
router.post('/', verifyToken, checkRole('mesero','admin'), crear);

// Listar pedidos → todos autenticados o público (vos decidís)
router.get('/', listar);

// Listar pedido por id → todos autenticados o público (vos decidís)
router.get('/:id', listarPorId);

// Actualizar estado → cocinero, mesero, cajero o admin
router.put('/:id/estado', verifyToken, checkRole('cocinero','mesero','cajero','admin'), actualizarEstado);

// Actualizar mesa → admin, mesero
router.put('/:id/mesa', verifyToken, checkRole('admin', 'mesero'), actualizarMesa);

// Actualizar detalles → admin, mesero
router.put('/:id/detalles', verifyToken, checkRole('admin', 'mesero'), actualizarDetalles);

// Cancelar pedido → solo admin
router.put('/:id/cancelar', verifyToken, checkRole('admin'), cancelar);

// Cerrar pedido (liberar mesa) → admin o cajero
router.put('/:id/cerrar', verifyToken, checkRole('admin','cajero'), cerrar);

module.exports = router;
