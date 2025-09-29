// src/controllers/detalle_pedido.controller.js
const { DetallePedido, Pedido, Plato } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los detalles de un pedido con paginación
const listarPorPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await DetallePedido.findAndCountAll({
      where: { pedidoId },
      include: [Plato],
      limit,
      offset,
      order: [['created_at', 'ASC']]
    });

    if (!rows.length) {
      return res.status(404).json({
        status: 404,
        message: 'No se encontraron detalles para este pedido'
      });
    }

    return res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      status: 200,
      message: 'Detalles obtenidos exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error al obtener detalles',
      error: error.message
    });
  }
};

// Agregar un nuevo detalle a un pedido
const agregar = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { platoId, cantidad } = req.body;

    if (!platoId || !cantidad) {
      return res.status(400).json({ message: 'Plato y cantidad son obligatorios' });
    }

    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    const plato = await Plato.findByPk(platoId);
    if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });

    const detalle = await DetallePedido.create({
      pedidoId,
      platoId,
      cantidad,
      precioUnitario: plato.precio
    });

    // Recalcular total
    const detalles = await DetallePedido.findAll({ where: { pedidoId } });
    const total = detalles.reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0);

    pedido.total = total;
    await pedido.save();

    res.status(201).json({
      data: detalle,
      status: 201,
      message: 'Detalle agregado exitosamente y total actualizado'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error al agregar detalle',
      error: error.message
    });
  }
};

// Editar un detalle (ej: cambiar cantidad)
const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const detalle = await DetallePedido.findByPk(id);
    if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });

    if (cantidad !== undefined) detalle.cantidad = cantidad;
    await detalle.save();

    // Recalcular total
    const detalles = await DetallePedido.findAll({ where: { pedidoId: detalle.pedidoId } });
    const total = detalles.reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0);

    const pedido = await Pedido.findByPk(detalle.pedidoId);
    pedido.total = total;
    await pedido.save();

    res.json({
      data: detalle,
      status: 200,
      message: 'Detalle actualizado y total recalculado'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error al editar detalle',
      error: error.message
    });
  }
};

// Eliminar un detalle
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetallePedido.findByPk(id);
    if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });

    const pedidoId = detalle.pedidoId;
    await detalle.destroy();

    // Recalcular total
    const detalles = await DetallePedido.findAll({ where: { pedidoId } });
    const total = detalles.reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0);

    const pedido = await Pedido.findByPk(pedidoId);
    pedido.total = total;
    await pedido.save();

    res.json({
      data: detalle,
      status: 200,
      message: 'Detalle eliminado y total actualizado'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error al eliminar detalle',
      error: error.message
    });
  }
};

module.exports = { listarPorPedido, agregar, editar, eliminar };
