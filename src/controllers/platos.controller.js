// src/controllers/platos.controller.js
const { Plato } = require('../models');

const listar = async (_req, res, next) => {
  try { res.json(await Plato.findAll()); } catch (e) { next(e); }
};

const crear = async (req, res, next) => {
  try { res.status(201).json(await Plato.create(req.body)); } catch (e) { next(e); }
};

const actualizar = async (req, res, next) => {
  try {
    const row = await Plato.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    await row.update(req.body);
    res.json(row);
  } catch (e) { next(e); }
};

const eliminar = async (req, res, next) => {
  try {
    const row = await Plato.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No existe' });
    await row.destroy();
    res.json({
        data: row,
        status: 204,
        message: 'Plato eliminado exitosamente'
    });
  } catch (e) { next(e); }
};

module.exports = { listar, crear, actualizar, eliminar }; 