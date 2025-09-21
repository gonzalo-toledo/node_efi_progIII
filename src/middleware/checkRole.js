
const checkRole = ( ...allowedRoles ) => {
    return ( req, res, next ) => {
        if ( !req.user ) return res.status(401).json({ message: 'No autorizado' });
        const { rol } = req.user;
        if ( allowedRoles.includes( rol ) ) {
            next();
        } else {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
    };
};

module.exports = checkRole;