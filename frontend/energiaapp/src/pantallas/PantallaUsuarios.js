import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';

const PantallaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/api/usuarios/usuarios');
        console.log('Usuarios:', response.data); // Log para depuración
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error.response ? error.response.data : error.message);
        Alert.alert('Error al cargar los usuarios');
      }
    };

    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (usuario_id) => {
    if (!usuario_id) {
      Alert.alert('Error', 'ID de usuario no proporcionado');
      return;
    }

    try {
      await axios.patch(`http://10.0.2.2:3000/api/usuarios/${usuario_id}`);
      Alert.alert('Usuario deshabilitado');
      setUsuarios(usuarios.filter(usuario => usuario.usuario_id !== usuario_id));
    } catch (error) {
      console.error('Error al deshabilitar el usuario:', error.response ? error.response.data : error.message);
      Alert.alert('Error al deshabilitar el usuario');
    }
  };

  const eliminarUsuarioFisicamente = async (usuario_id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/api/usuarios/${usuario_id}`);
      setUsuarios(usuarios.filter(usuario => usuario.usuario_id !== usuario_id));
      Alert.alert('Usuario eliminado físicamente con éxito');
    } catch (error) {
      console.error('Error al eliminar el usuario físicamente:', error.response ? error.response.data : error.message);
      Alert.alert('Error al eliminar el usuario físicamente');
    }
  };

  const actualizarUsuario = async (usuario_id) => {
    if (!usuario_id) {
      Alert.alert('Error', 'ID de usuario no proporcionado');
      return;
    }

    if (!editingUser || !editingUser.nombre || !editingUser.correo_electronico) {
      Alert.alert('Error', 'Nombre y correo electrónico son requeridos');
      return;
    }

    try {
      const response = await axios.put(`http://10.0.2.2:3000/api/usuarios/${usuario_id}`, {
        nombre: editingUser.nombre,
        correo_electronico: editingUser.correo_electronico,
        contraseña: editingUser.contraseña || null,
        usuario_modificador: 1 // Ajusta esto según sea necesario
      });
      Alert.alert('Usuario actualizado');
      setUsuarios(usuarios.map(usuario => (usuario.usuario_id === usuario_id ? response.data : usuario)));
      setEditingUser(null); // Deja de editar después de actualizar
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.response ? error.response.data : error.message);
      Alert.alert('Error al actualizar el usuario');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {editingUser && editingUser.usuario_id === item.usuario_id ? (
        <>
          <TextInput
            style={styles.input}
            value={editingUser.nombre}
            onChangeText={(text) => setEditingUser({ ...editingUser, nombre: text })}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={editingUser.correo_electronico}
            onChangeText={(text) => setEditingUser({ ...editingUser, correo_electronico: text })}
            placeholder="Correo Electrónico"
          />
          <TextInput
            style={styles.input}
            value={editingUser.contraseña}
            onChangeText={(text) => setEditingUser({ ...editingUser, contraseña: text })}
            placeholder="Contraseña"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => actualizarUsuario(item.usuario_id)}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditingUser(null)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>ID: {item.usuario_id}</Text>
          <Text>Nombre: {item.nombre}</Text>
          <Text>Correo Electrónico: {item.correo_electronico}</Text>
          <Text>Fecha de Registro: {item.fecha_registro ? item.fecha_registro : 'No disponible'}</Text>
          <Text>Estado: {item.estado === 1 ? 'Activo' : 'Inactivo'}</Text>
          <Text>Fecha de Modificación: {item.fecha_modificacion ? item.fecha_modificacion : 'No disponible'}</Text>
          <Text>ID Usuario Modificación: {item.usuario_modificador ? item.usuario_modificador : 'No disponible'}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditingUser(item)}
          >
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => eliminarUsuario(item.usuario_id)}
          >
            <Text style={styles.buttonText}>Deshabilitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => eliminarUsuarioFisicamente(item.usuario_id)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Usuarios Registrados</Text>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={item => item.usuario_id.toString()}
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
    borderRadius: 8,
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
});

export default PantallaUsuarios;
