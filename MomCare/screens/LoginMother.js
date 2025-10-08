import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Textura from '../assets/textura.png';
import {addDoc, collection, getDocs, query, where, orderBy} from 'firebase/firestore';
import { db } from "../firebaseConfig";

export default function LoginMother({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("Login:", { email, password });
    navigation.navigate("HomeMother");

    const dados = {
      email: email,
      senha: password,
    }

    await addDoc(collection(db, 'maes'), dados);

  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
         <Image source={Textura} style={styles.textura}/>
    
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WelcomeMother")} 
        >
          <Ionicons
            name="chevron-back"
            size={62}
            color="white"
            style={{
              textShadowColor: "#000",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            placeholder="Email:"
            placeholderTextColor="#C31E65"
            style={[styles.input, styles.shadowInput]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={[styles.passwordContainer, styles.shadowInput]}>
            <TextInput
              placeholder="Senha:"
              placeholderTextColor="#C31E65"
              style={styles.inputPassword}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingLeft: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#C31E65"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, styles.shadowInput]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>ou</Text>
            <View style={styles.line}></View>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerTextNormal}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("RegisterMother")}>
              <Text style={styles.registerText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C31E65",
  },
  backButton: {
    marginTop: 40,
    marginLeft: 20,
  },
    textura: {
    height: '100%',
    position: 'absolute',
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 200, 
    borderTopRightRadius: 80,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "85%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 12,
    borderWidth: 0,
    color: "#000",
  },
  shadowInput: {
    elevation: 15,
    shadowColor: "#555",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    height: 60,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 12,
    backgroundColor: "#fff",
  },
  inputPassword: {
    flex: 1,
    color: "#000",
  },
  loginButton: {
    width: "85%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    marginVertical: 12,
    borderWidth: 0,
  },
  loginButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 18,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "85%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#C31E65",
  },
  orText: {
    marginHorizontal: 10,
    color: "#C31E65",
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerTextNormal: {
    color: "#C31E65",
    fontWeight: "normal",
  },
  registerText: {
    color: "#C31E65",
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
});