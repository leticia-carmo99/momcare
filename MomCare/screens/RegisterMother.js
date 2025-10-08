import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, Modal, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Textura from '../assets/textura.png';

import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";  

export default function RegisterMother({ navigation }) {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para modal customizado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  // Função para abrir modal
  const showModal = (title, message, onConfirm = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  // Validação de email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Validação de CPF
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g,''); // remove caracteres não numéricos
    if(cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; // todos iguais

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Verifica se email já está cadastrado
  const checkEmailExists = async (email) => {
    const q = query(collection(db, "maes"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // true se achou e-mail igual
  };

  const handleRegister = async () => {
    if (loading) return; // previne múltiplos cliques

    if (!email || !cpf || !password || !confirmPassword) {
      showModal("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      showModal("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    if (!validateCPF(cpf)) {
      showModal("Erro", "CPF inválido. Por favor, insira um CPF válido.");
      return;
    }

    if (password.length < 8) {
      showModal("Erro", "A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const emailExists = await checkEmailExists(email.trim().toLowerCase());
      if (emailExists) {
        showModal("Erro", "Este e-mail já está cadastrado.");
        setLoading(false);
        return;
      }

      const dados = {
        email: email.trim().toLowerCase(),
        cpf: cpf.replace(/[^\d]+/g,''), // salva só números no CPF
        senha: password,
      };

      await addDoc(collection(db, "maes"), dados);

      showModal("Sucesso", "Cadastro realizado com sucesso!", () => navigation.navigate("HomeMother"));
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      showModal("Erro", "Erro ao cadastrar. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // ajuste conforme seu header
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Image source={Textura} style={{height: '100%', position: 'absolute'}} />

            <TouchableOpacity style={styles.backButton} 
              onPress={() => navigation.navigate("WelcomeMother")} 
              disabled={loading}
            >
              <Ionicons 
                name="chevron-back" 
                size={62}   
                color="white" 
                style={{ 
                  textShadowColor: '#000', 
                  textShadowOffset: {width: 1, height: 1}, 
                  textShadowRadius: 1 
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
                textContentType="emailAddress"
                autoComplete="email"
                editable={!loading}
              />
              <TextInput
                placeholder="CPF:"
                placeholderTextColor="#C31E65"
                style={[styles.input, styles.shadowInput]}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                editable={!loading}
              />
              <View style={[styles.passwordContainer, styles.passwordBorder]}>
                <TextInput
                  placeholder="Senha:"
                  placeholderTextColor="#C31E65"
                  style={styles.inputPassword}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  textContentType="password"
                  autoComplete="password-new"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#C31E65" />
                </TouchableOpacity>
              </View>

              <View style={[styles.passwordContainer, styles.passwordBorder]}>
                <TextInput
                  placeholder="Confirmar Senha:"
                  placeholderTextColor="#C31E65"
                  style={styles.inputPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  textContentType="password"
                  autoComplete="password-new"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#C31E65" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.registerButton, styles.shadowInput, loading && {opacity: 0.7}]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal customizado */}
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
    marginTop: 30,
    marginLeft: 20,
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 140,
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
    elevation: 15,
    shadowColor: "#555",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  passwordBorder: {
    borderWidth: 1,
    borderColor: "#C31E65",
  },
  inputPassword: {
    flex: 1,
    color: "#000",
  },
  registerButton: {
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
  registerButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 18,            
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