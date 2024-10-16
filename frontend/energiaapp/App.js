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
