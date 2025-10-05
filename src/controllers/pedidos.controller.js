// src/controllers/pedidos.controller.js
const { Pedido, DetallePedido, Plato, Mesa, Usuario } = require('../models');
const { Op } = require('sequelize');

// Listar pedidos
const listar = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const q = (req.query.q || '').toLowerCase().trim();
    const offset = (page - 1) * limit;

    // Condición de búsqueda
    const where = q ? { [Op.or]: [{ estado: { [Op.like]: `%${q}%` } }] } : {};


    const { rows, count } = await Pedido.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
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

//Listar por ID
const listarPorId = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id, {
    include: [
      {
        model: DetallePedido,
        as: 'detalles',
        include: [{model: Plato}]
      },
      {model: Mesa},
      {model: Usuario, as : 'mesero'}
    ],
  });
  
  if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
  res.json({ data: pedido });
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

    // Verificar que la mesa esté disponible
    if (!mesa.disponible) {
      return res.status(400).json({ message: 'La mesa está ocupada' });   
    }

    // Validar que no haya un pedido activo en esa mesa
    const existeActivo = await Pedido.findOne({
      where: { mesaId, estado: { [Op.notIn]: ['cancelado', 'cerrado'] } }
    });
    if (existeActivo) {
      return res.status(400).json({ message: 'La mesa ya tiene un pedido activo' });
    }

    //ocupar mesa
    mesa.disponible = false;
    await mesa.save({ transaction: t });

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

    // Lógica de transiciones según rol
    if (usuario.rol === 'cocinero') {
      if (pedido.estado === 'pendiente' && estado === 'en preparación') {
        pedido.estado = 'en preparación';
      } else if (pedido.estado === 'en preparación' && estado === 'listo') {
        pedido.estado = 'listo';
      } else {
        return res.status(400).json({ message: 'Transición no permitida para cocinero' });
      }

    } else if (usuario.rol === 'mesero') {
      if (pedido.estado === 'listo' && estado === 'servido') {
        pedido.estado = 'servido';
      } else if (pedido.estado === 'servido' && estado === 'cuenta solicitada') {
        pedido.estado = 'cuenta solicitada';
      } else {
        return res.status(400).json({ message: 'El mesero solo puede servir o pedir cuenta' });
      }

    } else if (usuario.rol === 'cajero') {
      if (pedido.estado === 'cuenta solicitada' && estado === 'pagado') {
        pedido.estado = 'pagado';
      } else {
        return res.status(400).json({ message: 'El cajero solo puede marcar un pedido como pagado' });
      }

    } else if (usuario.rol === 'admin') {
      // Admin puede forzar cualquier estado (auditoría o correcciones)
      pedido.estado = estado;
    } else {
      return res.status(403).json({ message: 'Rol no autorizado para cambiar estados' });
    }

    await pedido.save();
    res.json({
      data: pedido,
      message: `Estado actualizado a ${pedido.estado} exitosamente`
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
};

// Actualizar mesa de un pedido

const actualizarMesa = async (req, res) => {
  const t = await Pedido.sequelize.transaction();
  try {
    const { mesaId } = req.body;
    const usuario = req.user;

    if (!['admin', 'mesero'].includes(usuario.rol)) {
      return res.status(403).json({ message: 'No autorizado para cambiar la mesa' });
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    const nuevaMesa = await Mesa.findByPk(mesaId);
    if (!nuevaMesa) return res.status(404).json({ message: 'Mesa no encontrada' });
    if (!nuevaMesa.disponible) {
      return res.status(400).json({ message: 'La nueva mesa está ocupada' });
    }

    // Liberar la mesa anterior
    const mesaAnterior = await Mesa.findByPk(pedido.mesaId);
    if (mesaAnterior) {
      mesaAnterior.disponible = true;
      await mesaAnterior.save({ transaction: t });
    }

    // Ocupar la nueva mesa
    nuevaMesa.disponible = false;
    await nuevaMesa.save({ transaction: t });

    // Actualizar pedido
    pedido.mesaId = mesaId;
    await pedido.save({ transaction: t });

    await t.commit();
    res.json({
      data: pedido,
      message: 'Mesa actualizada exitosamente',
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message: 'Error al actualizar la mesa',
      error: error.message,
    });
  }
};



const actualizarDetalles = async (req, res) => {
  const t = await Pedido.sequelize.transaction();
  try {
    const { detalles } = req.body;
    const usuario = req.user;

    if (!['admin', 'mesero'].includes(usuario.rol)) {
      return res.status(403).json({ message: 'No autorizado para modificar detalles' });
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    // Solo permitir modificar si aún no entró en cocina
    if (pedido.estado !== 'pendiente') {
      return res.status(400).json({ message: 'No se pueden modificar los platos una vez enviado a cocina' });
    }

    // Eliminar detalles anteriores
    await DetallePedido.destroy({ where: { pedidoId: pedido.id }, transaction: t });

    // Crear nuevos detalles
    let total = 0;
    for (const item of detalles) {
      const plato = await Plato.findByPk(item.platoId);
      if (!plato) throw new Error(`Plato con id ${item.platoId} no encontrado`);
      const subtotal = plato.precio * item.cantidad;
      total += subtotal;

      await DetallePedido.create(
        {
          pedidoId: pedido.id,
          platoId: plato.id,
          cantidad: item.cantidad,
          precioUnitario: plato.precio,
        },
        { transaction: t }
      );
    }

    pedido.total = total;
    await pedido.save({ transaction: t });

    await t.commit();
    res.json({ data: pedido, message: 'Detalles del pedido actualizados correctamente ✅' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al actualizar detalles', error: error.message });
  }
};


// Cancelar pedido
const cancelar = async (req, res) => {
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

//cerrar pedido
const cerrar = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    const usuario = req.user;

    if (!['admin', 'cajero'].includes(usuario.rol)) {
      return res.status(403).json({ message: 'Solo el admin y el cajero pueden cerrar pedidos' });  
    }

    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    if (!['pagado', 'cancelado'].includes(pedido.estado)) {
      return res.status(400).json({ message: 'Solo se puede cerrar un pedido pagado o cancelado' });
    }

    pedido.estado = 'cerrado';
    await pedido.save();

    const mesa = await Mesa.findByPk(pedido.mesaId);
    if (mesa) {
      mesa.disponible = true;
      await mesa.save();
    }

    res.json({ data: pedido, message: 'Pedido cerrado y mesa liberada ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar pedido', error: error.message });
  }
};


module.exports = { crear, listar, listarPorId,actualizarEstado, cancelar, actualizarMesa, actualizarDetalles , cerrar };
