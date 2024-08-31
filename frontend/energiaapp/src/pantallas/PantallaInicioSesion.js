import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PantallaInicioSesion = ({ navigation }) => {
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');

  const iniciarSesion = () => {
    axios.post('http://10.0.2.2:3000/api/usuarios/iniciosesion', {
      correo_electronico,
      contraseña
    })
    .then(response => {
      Alert.alert('Inicio de sesión exitoso');
      navigation.navigate('PantallaPrincipal'); // Redirige a la pantalla principal después de iniciar sesión
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error de conexión o credenciales inválidas');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        value={correo_electronico}
        onChangeText={setCorreoElectronico}
      />
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <Button
        title="Iniciar Sesión"
        onPress={iniciarSesion}
      />
      <Button
        title="Registrarse"
        onPress={() => navigation.navigate('PantallaRegistro')}
        color="blue" // Puedes personalizar el color si lo deseas
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default PantallaInicioSesion;
