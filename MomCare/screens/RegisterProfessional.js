import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

export default function RegisterProfessional({ navigation }) {
  const [username, setUsername] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    console.log("Cadastrado:", { username, cpf, email, password, confirmPassword });
    navigation.navigate('HomeProfessional');  
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity style={styles.backButton} 
          onPress={() => navigation.navigate("WelcomeProfessional")} 
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
            placeholder="Usuário:"
            placeholderTextColor="#C31E65"
            style={[styles.input, styles.shadowInput]}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="CPF:"
            placeholderTextColor="#C31E65"
            style={[styles.input, styles.shadowInput]}
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="E-mail:"
            placeholderTextColor="#C31E65"
            style={[styles.input, styles.shadowInput]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={[styles.passwordContainer, styles.passwordBorder]}>
            <TextInput
              placeholder="Senha:"
              placeholderTextColor="#C31E65"
              style={styles.inputPassword}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#C31E65" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.registerButton, styles.shadowInput]} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
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
});
