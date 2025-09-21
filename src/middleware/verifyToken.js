const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ status: 403, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token);

    try {
        const decodedToken = jwt.verify(token, 'supersecret'); 
        // decodedToken = { id, email, rol, iat, exp }

        // Buscamos usuario en la BD (opcional pero más seguro)
        const user = await Usuario.findByPk(decodedToken.id);
        if (!user) {
            return res.status(401).json({ status: 401, message: 'Invalid user' });
        }

        // Guardamos en req.user toda la info que necesites
        req.user = {
            id: user.id,
            email: user.email,
            rol: user.rol
        };

        next();
    } catch (error) {
        return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
};

module.exports = verifyToken;
