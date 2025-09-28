// src/controllers/platos.controller.js
const { Plato } = require('../models');
const { Op } = require('sequelize');

const listar = async (req, res) => {
  try {
    // Parámetros de query
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const q = (req.query.q || '').toLowerCase().trim();
    const offset = (page - 1) * limit;

    // Condición de búsqueda
    const where = q ? { [Op.or]: [{ nombre: { [Op.like]: `%${q}%` } }] } : {};

    // Consulta con Sequelize
    const { rows, count } = await Plato.findAndCountAll({
      where,
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      status: 200,
      message: "Platos obtenidos exitosamente"
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: "error al obtener los platos",
      error: error.message 
    });
    
  }
};

//!NO ESTÁ EN LA CONSIGNA PERO SE PODRIA BUSCAR EL PLATO POR ID

const crear = async (req, res) => {
  try {
    const { nombre, precio, descripcion, disponibilidad } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ status: 400, message: "Faltan datos obligatorios" });
    }

    const plato = await Plato.create({ nombre, precio, descripcion, disponibilidad });
    res.status(201).json({
      data: plato,
      status: 201,
      message: "Plato creado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: "error al crear el plato",
      error: error.message 
    });
    
  }
};

const actualizar = async (req, res) => {
  try {
    const { nombre, precio, descripcion, disponibilidad } = req.body;
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) return res.status(404).json({ status: 404, message: 'Plato no encontrado' });

    plato.nombre = nombre || plato.nombre;
    plato.precio = precio || plato.precio;
    plato.descripcion = descripcion || plato.descripcion;
    plato.disponibilidad = (disponibilidad !== undefined) ? disponibilidad : plato.disponibilidad;

    await plato.save();
    res.json({
      data: plato,
      status: 200,
      message: "Plato actualizado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: "error al actualizar el plato",
      error: error.message 
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) return res.status(404).json({ status: 404, message: 'Plato no encontrado' });

    await plato.destroy();
    res.json({
      data: plato,
      status: 200,
      message: 'Plato eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 500, 
      message: "error al eliminar el plato",
      error: error.message
    })    
  }
};

module.exports = { listar, crear, actualizar, eliminar }; 