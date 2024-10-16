import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


const MQTT_PUB_POT = "EnchufeSmart/hab01/potencia";
const MQTT_CONTROL = "EnchufeSmart/hab01/control";


client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function App() {

  const [potencia, setPotencia] = useState(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Simulación de actualización del valor
    const interval = setInterval(() => {
      setValue((prevValue) => (prevValue + 10) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function onMessage(message) {
    if(message.destinationName === MQTT_PUB_POT)
        setPotencia(parseInt(message.payloadString));
  }

  useEffect(() => {
    client.connect( {
      onSuccess: () => { 
      console.log("Conexión exitosa al servidor MQTT!");
      client.subscribe(MQTT_PUB_POT);
      client.onMessageArrived = onMessage;
    },
    onFailure: () => {
      console.log("Error en la conexión al servidor MQTT!"); 
    }
  });
  }, [])

  function control(c, opcion) {
    //const message = new Paho.Message(temperatura.toString());
    const message = new Paho.Message(opcion.toString());
    message.destinationName = MQTT_CONTROL;
    c.send(message);
  }

  return (
      <View style={styles.container}>
        <View style={styles.cont1}>
          <Text style={styles.title}>Enchufe Inteligente con ESP32</Text>
      </View>
      <View style={{height: 50,}} />

      <View style={styles.gaugeContainer}>
        <View style={styles.gauge}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={potencia}
            tintColor="#EE4E4E"
            backgroundColor="#3d5875"
            lineCap="round"
            rotation={0}
          >
            {
              (fill) => (
                <Text style={styles.gaugeText}>
                  {`${Math.round(fill)} Wh`}
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.title2}>Consumo de Energía</Text>
        </View>
      </View>

      <View style={{height: 20,}} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { control(client, 1);} }>
          <Text style={styles.buttonText}>Encendido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { control(client, 0);} }>
          <Text style={styles.buttonText}>Apagado</Text>
        </TouchableOpacity>
      </View>      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50, // Ajusta este valor para cambiar la distancia desde la parte superior
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    //justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gaugeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  gauge: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  gaugeText: {
    fontSize: 20,
    color: '#EE4E4E',
    fontWeight: 'bold',
  },
  gaugeText2: {
    fontSize: 20,
    color: '#00e0ff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%', // Puedes ajustar este valor según sea necesario
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 10, // Espacio entre los botones
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separador: {
    width: 20,
  },
});