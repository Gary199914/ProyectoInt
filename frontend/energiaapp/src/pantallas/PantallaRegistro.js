import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PantallaRegistro = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [es_admin, setEsAdmin] = useState(0); // Añadido estado para es_admin

  const registrarUsuario = () => {
    axios.post('http://10.0.2.2:3000/api/usuarios/registro', {
      nombre,
      correo_electronico,
      contraseña,
      es_admin, // Se envía el valor de es_admin al backend
    })
    .then(response => {
      Alert.alert('Registro exitoso');
      navigation.navigate('PantallaInicioSesion');
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error de conexión');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
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
      <Text style={styles.label}>Tipo de Usuario:</Text>
      <TextInput
        style={styles.input}
        value={es_admin ? 'Administrador' : 'Usuario'}
        placeholder="Es Admin"
        onChangeText={(text) => setEsAdmin(text === 'Administrador' ? 1 : 0)}
      />
      <Button
        title="Registrarse"
        onPress={registrarUsuario}
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

export default PantallaRegistro;
