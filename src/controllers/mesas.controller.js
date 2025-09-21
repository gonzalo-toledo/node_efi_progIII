// src/controllers/mesas.controller.js
const { Mesa } = require('../models');

const listar = async (req, res, next) => {
  try {
    const { disponible } = req.query;
    const where = {};
    if (typeof disponible !== 'undefined') where.disponible = disponible === 'true';
    res.json(await Mesa.findAll({ where }));
  } catch (e) { next(e); }
};

const crear = async (req, res, next) => {
  try { res.status(201).json(await Mesa.create(req.body)); } catch (e) { next(e); }
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
