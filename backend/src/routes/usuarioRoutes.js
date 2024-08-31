const express = require('express');
const router = express.Router();
const { esAdmin,verificarToken} = require('../middleware/auth');
const { registrarUsuario,eliminarUsuarioFisicamente,obtenerUsuarios, actualizarUsuario, eliminarUsuario, iniciarSesionUsuario ,} = require('../controllers/usuarioController');

router.post('/registro', registrarUsuario);
router.get('/usuarios', obtenerUsuarios); // Para obtener todos los usuarios activos
router.put('/:usuario_id', actualizarUsuario);
router.patch('/:usuario_id', eliminarUsuario); // Usar PATCH para eliminar lógicamente
router.post('/iniciosesion', iniciarSesionUsuario);
router.delete('/:usuario_id', eliminarUsuarioFisicamente);
// Usa el middleware esAdmin para proteger rutas que solo los administradores deberían acceder

router.put('/admin/:usuario_id', esAdmin, actualizarUsuario); // Solo para admins
router.use(verificarToken); // Proteger todas las rutas después de este middleware
module.exports = router;


