import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PantallaPrincipal = ({ navigation }) => {
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const usuario = await AsyncStorage.getItem('usuario');
        if (usuario) {
          const { es_admin } = JSON.parse(usuario);
          setEsAdmin(es_admin);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario.');
      }
    };

    obtenerDatosUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pantalla Principal</Text>
      
      {esAdmin ? (
        <>
          <Button
            title="Ver Usuarios"
            onPress={() => navigation.navigate('PantallaUsuarios')}
          />
          {/* Puedes agregar más funciones específicas para el admin aquí */}
        </>
      ) : (
        <>
          <Button
            title="Agregar Dispositivo"
            onPress={() => navigation.navigate('PantallaRegistroDispositivos')}
          />
          <Button
            title="Ver Dispositivos"
            onPress={() => navigation.navigate('PantallaDispositivos')}
          />
        </>
      )}

      <Button
        title="Cerrar Sesión"
        onPress={() => navigation.navigate('PantallaInicioSesion')}
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
  titulo: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
});

export default PantallaPrincipal;
