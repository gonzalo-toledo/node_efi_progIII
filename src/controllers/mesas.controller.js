// src/controllers/mesas.controller.js
const { Mesa } = require('../models');

const listar = async (req, res, next) => {
  try {

    //Cuando pongas la condicion de busqueda ponela para que busque por capacidad!
    
    const { disponible } = req.query;
    const where = {};
    if (typeof disponible !== 'undefined') where.disponible = disponible === 'true';
    res.json(await Mesa.findAll({ where }));
  } catch (e) { next(e); }
};

const crear = async (req, res) => {
  try {
    const { numero, capacidad, disponible } = req.body;

    const exixte = await Mesa.findOne({ where: { numero } });
    if (exixte) {
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

const actualizar = async (req, res, next) => {
  try {
    const row = await Mesa.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

const eliminar = async (req, res, next) => {
  try {
    const row = await Mesa.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    await row.destroy();
    res.json({
        data: row,
        status: 204,
        message: 'Mesa eliminado exitosamente'
    });
  } catch (e) { next(e); }
};

module.exports = { listar, crear, actualizar, eliminar };
