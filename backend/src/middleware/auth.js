// src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Se requiere un token de autenticación' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido' });
        }
        req.usuario = usuario;
        next();
    });
};

// Middleware para verificar si el usuario es administrador
// src/middleware/auth.js
const esAdmin = (req, res, next) => {
    if (!req.usuario || !req.usuario.es_admin) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
};

module.exports = {
    verificarToken,
    esAdmin
};
