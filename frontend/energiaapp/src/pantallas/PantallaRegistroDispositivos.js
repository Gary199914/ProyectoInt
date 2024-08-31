// src/screens/PantallaRegistroDispositivos.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PantallaRegistroDispositivos = ({ navigation }) => {
  const [nuevoDispositivo, setNuevoDispositivo] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
  });

  const crearDispositivo = async () => {
    if (!nuevoDispositivo.nombre || !nuevoDispositivo.descripcion) {
      Alert.alert('Error', 'Nombre y descripción son requeridos');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', nuevoDispositivo.nombre);
      formData.append('descripcion', nuevoDispositivo.descripcion);
      if (nuevoDispositivo.imagen) {
        formData.append('imagen', {
          uri: nuevoDispositivo.imagen.uri,
          type: nuevoDispositivo.imagen.type,
          name: nuevoDispositivo.imagen.name,
        });
      }

      await axios.post('http://10.0.2.2:3000/api/dispositivos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Dispositivo agregado');
      setNuevoDispositivo({ nombre: '', descripcion: '', imagen: '' }); // Limpiar campos
      navigation.navigate('PantallaDispositivos'); // Navegar de vuelta a la lista de dispositivos
    } catch (error) {
      console.error('Error al agregar dispositivo:', error.response ? error.response.data : error.message);
      Alert.alert('Error al agregar el dispositivo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Nuevo Dispositivo</Text>
      <TextInput
        style={styles.input}
        value={nuevoDispositivo.nombre}
        onChangeText={(text) => setNuevoDispositivo({ ...nuevoDispositivo, nombre: text })}
        placeholder="Nombre del Dispositivo"
      />
      <TextInput
        style={styles.input}
        value={nuevoDispositivo.descripcion}
        onChangeText={(text) => setNuevoDispositivo({ ...nuevoDispositivo, descripcion: text })}
        placeholder="Descripción del Dispositivo"
      />
      {/* Aquí puedes agregar un componente de selección de imagen si es necesario */}
      <TouchableOpacity
        style={styles.button}
        onPress={crearDispositivo}
      >
        <Text style={styles.buttonText}>Agregar Dispositivo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginVertical: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PantallaRegistroDispositivos;
