// src/controllers/dispositivoController.js
const crearConexion = require('../config/db');

// Crear Dispositivo
const crearDispositivo = async (req, res) => {
    const { nombre, descripcion, imagen, usuario_id } = req.body;

    if (!nombre || !usuario_id) {
        return res.status(400).json({ error: 'El nombre y el ID del usuario son requeridos' });
    }

    let connection;
    try {
        connection = await crearConexion();
        const query = 'INSERT INTO dispositivos (nombre, descripcion, imagen, usuario_id) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(query, [nombre, descripcion, imagen, usuario_id]);

        res.status(201).json({ dispositivo_id: result.insertId, nombre, descripcion, imagen, usuario_id });
    } catch (error) {
        console.error('Error al crear el dispositivo:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Obtener Dispositivos del Usuario
const obtenerDispositivos = async (req, res) => {
    const { usuario_id } = req.params;

    let connection;
    try {
        connection = await crearConexion();
        const query = 'SELECT * FROM dispositivos WHERE usuario_id = ? AND estado = 1';
        const [result] = await connection.execute(query, [usuario_id]);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener dispositivos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Actualizar Dispositivo
const actualizarDispositivo = async (req, res) => {
    const { dispositivo_id } = req.params;
    const { nombre, descripcion, imagen, usuario_modificador } = req.body;

    let connection;
    try {
        connection = await crearConexion();
        const query = 'UPDATE dispositivos SET nombre = ?, descripcion = ?, imagen = ?, fecha_modificacion = NOW(), usuario_modificador = ? WHERE dispositivo_id = ? AND estado = 1';
        const [result] = await connection.execute(query, [nombre, descripcion, imagen, usuario_modificador, dispositivo_id]);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el dispositivo:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Eliminar Dispositivo (Soft Delete)
const eliminarDispositivo = async (req, res) => {
    const { dispositivo_id } = req.params;

    let connection;
    try {
        connection = await crearConexion();
        const query = 'UPDATE dispositivos SET estado = 0, fecha_modificacion = NOW() WHERE dispositivo_id = ? AND estado = 1';
        const [result] = await connection.execute(query, [dispositivo_id]);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al eliminar el dispositivo:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = {
    crearDispositivo,
    obtenerDispositivos,
    actualizarDispositivo,
    eliminarDispositivo
};
