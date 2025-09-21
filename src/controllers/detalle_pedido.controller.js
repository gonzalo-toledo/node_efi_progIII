// src/controllers/detalle_pedido.controller.js
const { DetallePedido, Plato } = require('../models');
const listarPorPedido = async (req, res, next) => {
  try {
    const rows = await DetallePedido.findAll({
      where: { pedidoId: req.params.pedidoId },
      include: [Plato]
    });
    res.json(rows);
  } catch (e) { next(e); }
};

module.exports = { listarPorPedido };
