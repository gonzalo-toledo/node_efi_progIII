// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../models');

// CJS interop para mailer (mailer es CommonJS)
const { sendEmail } = require('../utils/mailer');


// ===== Registro / Login / Perfil =====
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ nombre, email, password: hashed, rol });
    res.status(201).json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ where: { email, is_active: true } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (e) { next(e); }
};

const profile = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id, {
      attributes: ['id','nombre','email','rol','is_active','created_at','updated_at']
    });
    res.json(user);
  } catch (e) { next(e); }
};


const updateProfile = async (req, res, next) => {
  try {
    const { nombre, email } = req.body;
    const user = await Usuario.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;

    await user.save();

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    });
  } catch (e) {
    next(e);
  }
};

// ===== Recupero de contraseña (DEV: tokens en memoria) =====
const resetTokens = new Map(); // key: userId, value: { tokenHash, expiresAt }

const resetEmailTemplate = ({ nombre, resetUrl }) => `
  <div style="max-width:520px;margin:0 auto;padding:20px;background:#f5f5f5;border-radius:4px;font-family:Arial,sans-serif">
    <h2>Recuperá tu contraseña</h2>
    <p>Hola ${nombre || ''}, recibimos tu solicitud para restablecer la contraseña.</p>
    <p>Hacé clic en el siguiente enlace:</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007BFF;color:#fff;text-decoration:none;border-radius:4px">Restablecer contraseña</a></p>
    <p>Si no solicitaste esto, ignorá este correo.</p>
  </div>
`;

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });

    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min

    resetTokens.set(user.id, { tokenHash, expiresAt });

    const base = process.env.FRONT_URL || 'http://localhost:5173';
    const resetUrl = `${base}/recuperar-contrasena?token=${rawToken}&id=${user.id}`;

    await sendEmail({
      to: user.email,
      subject: 'Recuperar contraseña',
      html: resetEmailTemplate({ nombre: user.nombre, resetUrl })
    });

    res.json({ message: 'Email enviado si el usuario existe' });
  } catch (e) { next(e); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id, token, password } = req.body;
    if (!id || !token || !password) return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const entry = resetTokens.get(Number(id));
    if (!entry) return res.status(400).json({ message: 'Token no válido' });
    if (entry.expiresAt < Date.now()) return res.status(400).json({ message: 'Token expirado' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (entry.tokenHash !== tokenHash) return res.status(400).json({ message: 'Token no válido' });

    const user = await Usuario.findByPk(id);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    resetTokens.delete(Number(id));

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (e) { next(e); }
};

module.exports = {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword,
  updateProfile,
};
