import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, Modal 
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Textura from '../assets/textura.png';

import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";  

export default function RegisterProfessional({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal customizado
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

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

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

  const checkEmailExists = async (email) => {
    const q = query(collection(db, "profissionais"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkUsernameExists = async (username) => {
    const q = query(collection(db, "profissionais"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const validateUsername = (username) => {
    const re = /^[a-z0-9._]{1,15}$/;
    return re.test(username);
  };

  const handleUsernameChange = (text) => {
    let cleaned = text.startsWith('@') ? text.slice(1) : text;
    const filtered = cleaned.toLowerCase().replace(/[^a-z0-9._]/g, "");
    if (filtered.length <= 15) {
      setUsername(filtered ? '@' + filtered : '');
    }
  };

  const handleRegister = async () => {
    if (loading) return;

    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

    if (!cleanUsername || !email || !cpf || !password || !confirmPassword) {
      showModal("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateUsername(cleanUsername)) {
      showModal("Erro", "Usuário inválido. Use até 15 caracteres com letras minúsculas, números, '.' ou '_'.");
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
      const usernameExists = await checkUsernameExists(cleanUsername);
      if (usernameExists) {
        showModal("Erro", "Este nome de usuário já está em uso.");
        setLoading(false);
        return;
      }

      const emailExists = await checkEmailExists(email.trim().toLowerCase());
      if (emailExists) {
        showModal("Erro", "Este e-mail já está cadastrado.");
        setLoading(false);
        return;
      }

      const dados = {
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        cpf: cpf.replace(/[^\d]+/g,''),
        senha: password,
      };

      await addDoc(collection(db, "profissionais"), dados);

      showModal("Sucesso", "Cadastro realizado com sucesso!", () => navigation.navigate("HomeProfessional"));
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      showModal("Erro", "Erro ao cadastrar. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#C31E65' }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={{ flex: 1 }}>
          <Image source={Textura} style={styles.backgroundImage} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("WelcomeProfessional")}
            disabled={loading}
          >
            <Ionicons
              name="chevron-back"
              size={62}
              color="white"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            />
          </TouchableOpacity>

          <View style={styles.form}>
            <View style={{ width: "85%", marginVertical: 12 }}>
              <TextInput
                placeholder="Usuário:"
                placeholderTextColor="#C31E65"
                style={[styles.input, styles.shadowInput]}
                value={username}
                onChangeText={handleUsernameChange}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={16} 
                keyboardType="default"
              />
              <Text style={styles.usernameHelperText}>
                Apenas 15 caracteres: letras minúsculas, números, '.' e '_'. Não se pode repetir nomes em uso.
              </Text>
            </View>

            <View style={{ width: "85%", marginVertical: 12 }}>
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
            </View>

            <View style={{ width: "85%", marginVertical: 12 }}>
              <TextInput
                placeholder="CPF:"
                placeholderTextColor="#C31E65"
                style={[styles.input, styles.shadowInput]}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

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
              style={[styles.registerButton, styles.shadowInput, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
            </TouchableOpacity>
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    marginTop: 30,
    marginLeft: 20,
    zIndex: 2,
  },
  form: {
    backgroundColor: "white",
    marginTop: 140,
    borderTopRightRadius: 80,
    padding: 20,
    alignItems: "center",
    flex: 1,
  },
  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#C31E65",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  modalOkButton: {
    backgroundColor: "#C31E65",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalOkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  usernameHelperText: {
    color: "#C31E65",
    fontSize: 12,
    marginTop: 5,
    fontStyle: "italic",
  },
});

