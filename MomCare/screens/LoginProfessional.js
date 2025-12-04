import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image, Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Textura from '../assets/textura.png';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebaseConfig";

import { useProfessional } from "../providers/ProfessionalContext";

export default function LoginProfessional({ navigation }) {

  const { login } = useProfessional();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  const showModal = (title, message, onConfirm = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

const handleLogin = async () => {
  if (!email || !password) {
    showModal("Erro", "Por favor, preencha todos os campos.");
    return;
  }

  setLoading(true);

  try {
    const result = await login(email.trim().toLowerCase(), password);

    showModal("Bem-vinda!", "Login realizado com sucesso!", () => {
      setModalVisible(false);
      navigation.navigate("HomeProfessional");
    });

  } catch (err) {
    showModal("Erro", err.message || "Erro ao fazer login.");
  }

  setLoading(false);
};

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={Textura} style={styles.textura} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("WelcomeProfessional")}
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
              placeholder="E-mail:"
              placeholderTextColor="#C31E65"
              style={[styles.input, styles.shadowInput]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <View style={[styles.passwordContainer, styles.shadowInput]}>
              <TextInput
                placeholder="Senha:"
                placeholderTextColor="#C31E65"
                style={styles.inputPassword}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingLeft: 10 }}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#C31E65"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, styles.shadowInput, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line}></View>
              <Text style={styles.orText}>ou</Text>
              <View style={styles.line}></View>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerTextNormal}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterProfessional")}>
                <Text style={styles.registerText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#C31E65" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalOkButton}
              onPress={() => {
                setModalVisible(false);
                if (modalOnConfirm) modalOnConfirm();
              }}
            >
              <Text style={styles.modalOkButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C31E65",
    marginBottom: 15,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  modalOkButton: {
    backgroundColor: "#C31E65",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  modalOkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },  
});



