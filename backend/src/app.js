require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const usuarioRouter = require('./routes/usuarioRoutes');
const dispositivoRouter = require('./routes/dispositivoRoutes');

app.use(express.json());

// Utiliza el router de usuarios para las rutas que comienzan con /api/usuarios
app.use('/api/usuarios', usuarioRouter,dispositivoRouter);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
