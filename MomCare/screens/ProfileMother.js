import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import BottomNav from "../components/BottomNavMother";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";

// Função mockada para simular envio ao banco de dados
async function updateUserName(userId, newName) {
  // Aqui você deve substituir pela sua lógica de envio real
  console.log("Salvando nome no banco:", userId, newName);
  return Promise.resolve(); // Simula sucesso
}

export default function ProfileMotherScreen({ navigation, route }) {
  const user = route?.params?.user;

  const [name, setName] = useState(user?.name || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNameInput, setNewNameInput] = useState("");

  if (!user) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            marginTop: 100,
            textAlign: "center",
            fontSize: 16,
            color: "#C31E65",
          }}
        >
          Usuário não encontrado. Faça login novamente.
        </Text>
      </View>
    );
  }

  const handleEditName = async () => {
    if (!newNameInput.trim()) {
      Alert.alert("Erro", "Digite um nome válido.");
      return;
    }

    try {
      await updateUserName(user.id, newNameInput); // Envie para o banco
      setName(newNameInput); // Atualiza localmente
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/fotoperfil.png")}
            style={styles.profileImage}
          />
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {name ? name : "Insira seu nome"}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Feather name="edit-2" size={16} color="#C31E65" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>@{user.username}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Mãe de primeira viagem</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <View style={styles.babyHeader}>
            <MaterialCommunityIcons
              name="baby-bottle-outline"
              size={22}
              color="#C31E65"
            />
            <Text style={styles.babyCardTitle}>Informações do bebê</Text>
          </View>

          <View style={styles.babyRow}>
            <View style={styles.babyInfoBox}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{user.babyName || "Sofia"}</Text>
            </View>
            <View style={styles.babyInfoBox}>
              <Text style={styles.label}>Idade</Text>
              <Text style={styles.value}>{user.babyAge || "3 meses e 12 dias"}</Text>
            </View>
          </View>

          <View style={styles.babyRow}>
            <View style={styles.babyInfoBox}>
              <Text style={styles.label}>Nascimento</Text>
              <Text style={styles.value}>{user.babyBirthDate || "28/09/2025"}</Text>
            </View>
            <View style={styles.babyInfoBox}>
              <Text style={styles.label}>Peso atual</Text>
              <Text style={styles.value}>{user.babyWeight || "5.2Kg"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.daysAsMother || 127}</Text>
            <Text style={styles.statLabel}>dias como mãe</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.articlesRead || 47}</Text>
            <Text style={styles.statLabel}>artigos lidos</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("ForumMother", { user })}
          >
            <Ionicons name="people-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Comunidade de mães</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Daily", { user })}
          >
            <MaterialCommunityIcons
              name="notebook-outline"
              size={24}
              color="#555"
            />
            <Text style={styles.actionText}>Diário da mamãe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="ProfileMother" user={user} />

      {/* Modal de Edição do Nome */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar nome</Text>
            <TextInput
              value={newNameInput}
              onChangeText={setNewNameInput}
              placeholder="Digite seu nome"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleEditName}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 90 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 20 },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
  },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 20, fontWeight: "bold", color: "#C31E65" },
  username: { fontSize: 14, color: "#888", marginBottom: 8 },
  tag: {
    backgroundColor: "#FFD6EC",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#C31E65",
  },
  tagText: { color: "#C31E65", fontSize: 13 },
  cardWithShadow: {
    backgroundColor: "#FAFAFA",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  babyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  babyCardTitle: {
    color: "#C31E65",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  babyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  babyInfoBox: { flex: 1, marginRight: 10 },
  label: { fontSize: 12, color: "#666" },
  value: { fontSize: 14, fontWeight: "bold", color: "#000" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: "#FFECF7",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#F7E2EB",
    shadowColor: "#C31E65",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#C31E65" },
  statLabel: { fontSize: 12, color: "#666", textAlign: "center" },
  actionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: { marginLeft: 10, fontSize: 14, color: "#333" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#C31E65",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#C31E65",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#999",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});









