import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/login', { email, contraseña });
            localStorage.setItem('token', respuesta.data.token);
            // Redirigir a la pantalla de inicio o donde sea necesario
        } catch (error) {
            console.error(error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <form onSubmit={manejarEnvio}>
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
            <button type="submit">Iniciar sesión</button>
        </form>
    );
};

export default Login;
