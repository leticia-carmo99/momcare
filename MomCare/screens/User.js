import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import logo from "../assets/logoname.png";
import linhasCima from "../assets/linhascima.png";
import linhasBaixo from "../assets/linhasbaixo.png";

export default function User({ navigation }) {
  return (
    <>
      <StatusBar
        backgroundColor="#fff" 
        barStyle="dark-content"  
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          <Image source={linhasCima} style={styles.linhaCima} resizeMode="cover" />
          <Image source={linhasBaixo} style={styles.linhaBaixo} resizeMode="cover" />

          <Image source={logo} style={styles.logoImage} resizeMode="contain" />

          <Text style={styles.questionText}>Como deseja utilizar o app?</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MotherStack', { screen: 'WelcomeMother' })}
          >
            <Text style={styles.buttonText}>Mãe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ProfessionalStack', { screen: 'WelcomeProfessional' })}
          >
            <Text style={styles.buttonText}>Profissional</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoImage: {
    width: 320,
    height: 320,
    marginBottom: 20,
    pointerEvents: "none",
  },
  linhaCima: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "120%",
    height: 400,
    pointerEvents: "none",
  },
  linhaBaixo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "110%",
    height: 600,
    pointerEvents: "none",
  },
  questionText: {
    fontSize: 16,
    color: "#9E9E9E",
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    width: "70%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 0,
    elevation: 15, 
    shadowColor: "#555",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  buttonText: {
    color: "#C31E65",
    fontSize: 18,
    fontWeight: "bold",
  },
});
