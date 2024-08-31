import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PantallaRegistro from './pantallas/PantallaRegistro';
import PantallaInicioSesion from './pantallas/PantallaInicioSesion';
import PantallaUsuarios from './pantallas/PantallaUsuarios';
import PantallaPrincipal from './pantallas/PantallaPrincipal';
import PantallaDispositivos from './pantallas/PantallaDispositivos';
import PantallaRegistroDispositivos from './pantallas/PantallaRegistroDispositivos';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PantallaInicioSesion">
        <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} />
        <Stack.Screen name="PantallaInicioSesion" component={PantallaInicioSesion} />
        <Stack.Screen name="PantallaUsuarios" component={PantallaUsuarios} />
        <Stack.Screen name="PantallaPrincipal" component={PantallaPrincipal} />
        <Stack.Screen name="PantallaDispositivos"component={PantallaDispositivos}/>
        <Stack.Screen name="PantallaRegistroDispositivos" component={PantallaRegistroDispositivos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;




