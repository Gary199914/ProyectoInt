import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/usuarios/registro', { nombre, email, contraseña });
            // Redirigir a la pantalla de login o donde sea necesario
        } catch (error) {
            console.error(error);
            alert('Error al registrar el usuario');
        }
    };

    return (
        <form onSubmit={manejarEnvio}>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
            />
            <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default Registro;
