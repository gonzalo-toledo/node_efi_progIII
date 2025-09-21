// src/controllers/pedidos.controller.js
const { Pedido, Mesa, DetallePedido, Plato } = require('../models');

const crear = async (req, res, next) => {
  try {
    const { mesaId, items } = req.body; // items: [{platoId, cantidad}]
    const mesa = await Mesa.findByPk(mesaId);
    if (!mesa) return res.status(400).json({ message: 'Mesa inválida' });

    const pedido = await Pedido.create({ mesaId, meseroId: req.user.id, estado: 'pendiente', total: 0 });
    let total = 0;

    for (const it of (items || [])) {
      const plato = await Plato.findByPk(it.platoId);
      if (!plato || !plato.disponibilidad) continue;
      const precio = Number(plato.precio);
      await DetallePedido.create({ pedidoId: pedido.id, platoId: plato.id, cantidad: it.cantidad, precioUnitario: precio });
      total += (it.cantidad || 0) * precio;
    }
    await pedido.update({ total });
    res.status(201).json(pedido);
  } catch (e) { next(e); }
};

const listar = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.rol === 'mesero') where.meseroId = req.user.id;

    // Nota: mantener import dinámico como en tu versión anterior si así lo preferís.
    const { Mesa: MesaModel, DetallePedido: DetalleModel, Plato: PlatoModel } = await import('../models/index.js');

    const rows = await Pedido.findAll({
      where,
      include: [
        { model: MesaModel },
        { model: DetalleModel, as: 'detalles', include: [PlatoModel] }
      ],
      order: [['created_at','DESC']]
    });
    res.json(rows);
  } catch (e) { next(e); }
};

const cambiarEstado = async (req, res, next) => {
  try {
    const row = await Pedido.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    const { estado } = req.body; // 'pendiente'|'en preparación'|'servido'
    await row.update({ estado });
    res.json(row);
  } catch (e) { next(e); }
};

const eliminar = async (req, res, next) => {
  try {
    const row = await Pedido.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    await row.destroy();
    res.json({
        data: row,
        status: 204,
        message: 'Pedido eliminado exitosamente'
    });
  } catch (e) { next(e); }
};

module.exports = { crear, listar, cambiarEstado, eliminar };
