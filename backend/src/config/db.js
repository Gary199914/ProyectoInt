const mysql = require('mysql2/promise');
require('dotenv').config(); // Asegúrate de que dotenv esté configurado si usas variables de entorno

// Crear la conexión a la base de datos
const crearConexion = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('¡Base de datos conectada!');
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error; // Lanza el error para que pueda ser capturado en otros lugares
  }
};

module.exports = crearConexion;
