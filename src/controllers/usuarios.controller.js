// src/controllers/usuarios.controller.js
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const list = async (req, res, next) => {
    try {
        const usuarios = await Usuario.findAll({
        attributes: ['id', 'nombre', 'email', 'rol', 'is_active', 'created_at', 'updated_at'],
        order: [['created_at', 'DESC']]
        });
        res.json(usuarios);
    } catch (e) {
        next(e);
    }
    };

    const getById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
        attributes: ['id', 'nombre', 'email', 'rol', 'is_active', 'created_at', 'updated_at']
        });
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (e) {
        next(e);
    }
    };

    const create = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await Usuario.create({ 
        nombre, 
        email, 
        password: hashed, 
        rol 
        });
        
        res.status(201).json({ 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol 
        });
    } catch (e) {
        next(e);
    }
    };

    const update = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { nombre, email, password } = req.body;
        
        if (nombre) usuario.nombre = nombre;
        if (email) usuario.email = email;
        if (password) usuario.password = await bcrypt.hash(password, 10);

        await usuario.save();

        res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
        });
    } catch (e) {
        next(e);
    }
    };

    const deleteUser = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Soft delete
        usuario.is_active = false;
        await usuario.save();

        // O hard delete:
        // await usuario.destroy();

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
    };

    const updateRole = async (req, res, next) => {
    try {
        const { rol } = req.body;
        const usuario = await Usuario.findByPk(req.params.id);
        
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!['admin', 'cocinero', 'mesero', 'cajero'].includes(rol)) {
        return res.status(400).json({ message: 'Rol inválido' });
        }

        usuario.rol = rol;
        await usuario.save();

        res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    list,
    getById,
    create,
    update,
    deleteUser,
    updateRole
};