// src/controllers/pedidos.controller.js
const { Pedido, DetallePedido, Plato, Mesa, Usuario } = require('../models');


// Listar pedidos
const listar = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const q = (req.query.q || '').toLowerCase().trim();
    const offset = (page - 1) * limit;

    // Condición de búsqueda
    const where = q ? { estado: { [Op.like]: `%${q}%` } } : {};


    const { rows, count } = await Pedidos.findAndCountAll({
      where,
      limit,
      offset,
      order: [['capacidad', 'ASC']]
    });

    return res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      status: 200,
      message: 'Pedidos obtenidos exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error al listar pedidos',
      error: error.message
    });
  }
};


// Crear un pedido
const crear = async (req, res) => {
  const t = await Pedido.sequelize.transaction();
  try {
    const { mesaId, meseroId, detalles } = req.body;
    // detalles: [{ platoId, cantidad }, ...]

    if (!mesaId || !meseroId || !detalles || !detalles.length) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // Verificar que la mesa exista
    const mesa = await Mesa.findByPk(mesaId);
    if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });

    // Crear el pedido
    const pedido = await Pedido.create({ mesaId, meseroId, estado: 'pendiente', total: 0 }, { transaction: t });

    let total = 0;
    for (const item of detalles) {
      const plato = await Plato.findByPk(item.platoId);
      if (!plato) throw new Error(`Plato con id ${item.platoId} no encontrado`);

      const subtotal = plato.precio * item.cantidad;
      total += subtotal;

      await DetallePedido.create({
        pedidoId: pedido.id,
        platoId: plato.id,
        cantidad: item.cantidad,
        precioUnitario: plato.precio
      }, { transaction: t });
    }

    pedido.total = total;
    await pedido.save({ transaction: t });

    await t.commit();
    res.status(201).json({ 
      data: pedido,
      message: 'Pedido creado exitosamente' 
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ 
      message: 'Error al crear el pedido',
      error: error.message 
    });
  }
};


// Actualizar estado de un pedido
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuario = req.user;

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    if (usuario.rol === 'cocinero') {
      if (pedido.estado === 'pendiente' && estado === 'en preparación') pedido.estado = 'en preparación';
      else if (pedido.estado === 'en preparación' && estado === 'servido') pedido.estado = 'servido';
      else return res.status(400).json({ message: 'Transición de estado no permitida para cocinero' });
    } else if (usuario.rol === 'mesero') {
      if (estado === 'servido') pedido.estado = 'servido';
      else return res.status(400).json({ message: 'El mesero solo puede marcar como servido' });
    } else if (usuario.rol === 'admin') {
      pedido.estado = estado;
    }

    await pedido.save();
    res.json({ 
      data: pedido,
      message: 'Estado actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar estado',
      error: error.message 
    });
  }
};

// Eliminar pedido
const eliminar = async (req, res) => {
  try {
    const usuario = req.user;
    if (usuario.rol !== 'admin') {
      return res.status(403).json({ message: 'Solo el admin puede cancelar pedidos' });
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Si ya estaba cancelado, no lo volvemos a tocar
    if (pedido.estado === 'cancelado') {
      return res.json({ 
        data: pedido, 
        message: 'El pedido ya estaba cancelado' 
      });
    }

    pedido.estado = 'cancelado';
    await pedido.save();

    res.json({ 
      data: pedido, 
      message: 'Pedido cancelado exitosamente (borrado lógico)' 
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al cancelar el pedido', 
      error: error.message 
    });
  }
};


module.exports = { crear, listar, actualizarEstado, eliminar };
