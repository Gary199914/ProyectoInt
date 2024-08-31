const crearConexion = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar Usuario
const registrarUsuario = async (req, res) => {
  const { nombre, correo_electronico, contraseña, es_admin } = req.body;

  if (!nombre || !correo_electronico || !contraseña) {
    return res.status(400).json({ error: 'Nombre, correo electrónico y contraseña son requeridos' });
  }

  let connection;
  try {
    connection = await crearConexion();
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, correo_electronico, contraseña, es_admin) VALUES (?, ?, ?, ?)', 
      [nombre, correo_electronico, hashedPassword, es_admin || 0]
    );

    res.status(201).json({ usuario_id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) {
      await connection.end(); // Cerrar la conexión
    }
  }
};

// Obtener Usuarios
const obtenerUsuarios = async (req, res) => {
  let connection;
  try {
    connection = await crearConexion();
    const query = 'SELECT * FROM usuarios WHERE estado = 1';
    const [result] = await connection.execute(query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end(); // Cerrar la conexión
    }
  }
};

// Actualizar Usuario
const actualizarUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  const { nombre, correo_electronico, contraseña, usuario_modificador } = req.body;

  let connection;
  try {
    connection = await crearConexion();

    const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : null;

    let query = 'UPDATE usuarios SET nombre = ?, correo_electronico = ?, fecha_modificacion = NOW(), usuario_modificador = ?';
    const params = [nombre, correo_electronico, usuario_modificador];

    if (hashedPassword) {
      query += ', contraseña = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE usuario_id = ? AND estado = 1';
    params.push(usuario_id);

    const [result] = await connection.execute(query, params);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end(); // Cerrar la conexión
    }
  }
};

// Eliminar Usuario (Lógica)
const eliminarUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id) {
    return res.status(400).json({ error: 'ID de usuario no proporcionado' });
  }

  let connection;
  try {
    connection = await crearConexion();
    const query = 'UPDATE usuarios SET estado = 0, fecha_modificacion = NOW() WHERE usuario_id = ? AND estado = 1';
    const [result] = await connection.execute(query, [usuario_id]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end(); // Cerrar la conexión
    }
  }
};

// Eliminar Usuario (Físico)
const eliminarUsuarioFisicamente = async (req, res) => {
  const { usuario_id } = req.params;

  let connection;
  try {
    connection = await crearConexion();
    const query = 'DELETE FROM usuarios WHERE usuario_id = ?';
    const [result] = await connection.execute(query, [usuario_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado físicamente con éxito' });
  } catch (error) {
    console.error('Error al eliminar el usuario físicamente:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Iniciar Sesión Usuario
const iniciarSesionUsuario = async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  if (!correo_electronico || !contraseña) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
  }

  let connection;
  try {
    connection = await crearConexion();
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo_electronico = ?', [correo_electronico]);
    const usuario = rows[0];

    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ usuario_id: usuario.usuario_id, es_admin: usuario.es_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  registrarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  iniciarSesionUsuario,
  eliminarUsuarioFisicamente,
};
