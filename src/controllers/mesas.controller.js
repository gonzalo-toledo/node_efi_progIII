// src/controllers/mesas.controller.js
const { Mesa } = require('../models');
const { Op } = require('sequelize');

const listar = async (req, res) => {
  try {
    //Cuando pongas la condicion de busqueda ponela para que busque por capacidad!
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const q = (req.query.q || '').toLowerCase().trim();
    const offset = (page - 1) * limit;

    // Condición de búsqueda
    const where = q ? { [Op.or]: [{ capacidad: { [Op.like]: `%${q}%` } }] } : {};

    const { rows, count } = await Mesa.findAndCountAll({
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
      message: 'Mesas obtenidas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: 'error al obtener las mesas',
      error: error.message 
    }); 
  }
};

const crear = async (req, res) => {
  try {
    const { numero, capacidad, disponible } = req.body;

    const existe = await Mesa.findOne({ where: { numero } });
    if (existe) {
      return res.status(400).json({ message: 'Ya existe una mesa con ese número' });
    }

    const mesa = await Mesa.create({ numero, capacidad, disponible });
    res.status(201).json({
      data: mesa,
      status: 201,
      message: 'Mesa creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: "error al crear la mesa",
      error: error.message 
    });
    }
};

const actualizar = async (req, res) => {
  try {
    const { capacidad, disponible } = req.body;
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).json({ message: 'No existe la mesa seleccionada' });
    mesa.capacidad = capacidad || mesa.capacidad;
    mesa.disponible = disponible !== undefined ? disponible : mesa.disponible;
    
    await mesa.save();
    res.json({
      data: mesa,
      status: 200,
      message: "Mesa actualizado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500, 
      message: "error al actualizar la mesa",
      error: error.message 
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });
    await mesa.destroy();
    res.json({
        data: mesa,
        status: 204,
        message: 'Mesa eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 500, 
      message: "error al eliminar la mesa",
      error: error.message 
    });
  }
};

module.exports = { listar, crear, actualizar, eliminar };
