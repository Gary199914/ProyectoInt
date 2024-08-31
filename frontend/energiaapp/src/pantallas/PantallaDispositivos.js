import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';

const PantallaDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [editingDispositivo, setEditingDispositivo] = useState(null);

  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/api/dispositivos');
        setDispositivos(response.data);
      } catch (error) {
        console.error('Error al cargar dispositivos:', error.response ? error.response.data : error.message);
        Alert.alert('Error al cargar los dispositivos');
      }
    };

    fetchDispositivos();
  }, []);

  const eliminarDispositivo = async (dispositivo_id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/api/dispositivos/${dispositivo_id}`);
      setDispositivos(dispositivos.filter(dispositivo => dispositivo.dispositivo_id !== dispositivo_id));
      Alert.alert('Dispositivo eliminado');
    } catch (error) {
      console.error('Error al eliminar el dispositivo:', error.response ? error.response.data : error.message);
      Alert.alert('Error al eliminar el dispositivo');
    }
  };

  const actualizarDispositivo = async (dispositivo_id) => {
    if (!dispositivo_id) {
      Alert.alert('Error', 'ID de dispositivo no proporcionado');
      return;
    }

    if (!editingDispositivo || !editingDispositivo.nombre || !editingDispositivo.descripcion) {
      Alert.alert('Error', 'Nombre y descripción son requeridos');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', editingDispositivo.nombre);
      formData.append('descripcion', editingDispositivo.descripcion);
      if (editingDispositivo.imagen) {
        formData.append('imagen', {
          uri: editingDispositivo.imagen.uri,
          type: editingDispositivo.imagen.type,
          name: editingDispositivo.imagen.name,
        });
      }

      const response = await axios.put(`http://10.0.2.2:3000/api/dispositivos/${dispositivo_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Dispositivo actualizado');
      setDispositivos(dispositivos.map(dispositivo => (dispositivo.dispositivo_id === dispositivo_id ? response.data : dispositivo)));
      setEditingDispositivo(null); // Deja de editar después de actualizar
    } catch (error) {
      console.error('Error al actualizar el dispositivo:', error.response ? error.response.data : error.message);
      Alert.alert('Error al actualizar el dispositivo');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {editingDispositivo && editingDispositivo.dispositivo_id === item.dispositivo_id ? (
        <>
          <TextInput
            style={styles.input}
            value={editingDispositivo.nombre}
            onChangeText={(text) => setEditingDispositivo({ ...editingDispositivo, nombre: text })}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={editingDispositivo.descripcion}
            onChangeText={(text) => setEditingDispositivo({ ...editingDispositivo, descripcion: text })}
            placeholder="Descripción"
          />
          {editingDispositivo.imagen && <Image source={{ uri: editingDispositivo.imagen.uri }} style={styles.image} />}
          <TouchableOpacity
            style={styles.button}
            onPress={() => actualizarDispositivo(item.dispositivo_id)}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditingDispositivo(null)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>ID: {item.dispositivo_id}</Text>
          <Text>Nombre: {item.nombre}</Text>
          <Text>Descripción: {item.descripcion}</Text>
          {item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditingDispositivo(item)}
          >
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => eliminarDispositivo(item.dispositivo_id)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Dispositivos Registrados</Text>
      <FlatList
        data={dispositivos}
        renderItem={renderItem}
        keyExtractor={item => item.dispositivo_id.toString()}
      />
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
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8
,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
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
image: {
width: 100,
height: 100,
resizeMode: 'cover',
marginVertical: 8,
},
});

export default PantallaDispositivos;