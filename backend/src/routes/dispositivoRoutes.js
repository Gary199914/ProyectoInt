// src/routes/dispositivoRuta.js
const express = require('express');
const router = express.Router();
const { crearDispositivo, obtenerDispositivos, actualizarDispositivo, eliminarDispositivo } = require('../controllers/dispositivoController');

// Crear Dispositivo
router.post('/dispositivos',crearDispositivo);

// Obtener Dispositivos de un Usuario
router.get('/:usuario_id',obtenerDispositivos);

// Actualizar Dispositivo
router.put('/:dispositivo_id',actualizarDispositivo);

// Eliminar Dispositivo (Soft Delete)
router.patch('/:dispositivo_id',eliminarDispositivo);

module.exports = router;
