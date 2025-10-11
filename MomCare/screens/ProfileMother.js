import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavMother";

import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProfileMother({ navigation }) {
  const [currentUserId, setCurrentUserId] = useState(null);

  const [motherData, setMotherData] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [babies, setBabies] = useState([]);
  const [loadingBabies, setLoadingBabies] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState("");
  const [babyWeight, setBabyWeight] = useState("");

  useEffect(() => {
    const auth = getAuth();

    // Escutando autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        navigation.navigate("LoginMother");
      }
    });

    // Cleanup do listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMotherData();
      fetchBabies();
    }
  }, [currentUserId]);

  const fetchMotherData = async () => {
    try {
      const docRef = doc(db, "maes", currentUserId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMotherData(docSnap.data());
        setNameInput(docSnap.data().nome || "");
      } else {
        console.log("Mãe não encontrada");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da mãe:", error);
    }
  };

  const fetchBabies = async () => {
    setLoadingBabies(true);
    try {
      const q = query(
        collection(db, "bebes"),
        where("maeId", "==", currentUserId)
      );
      const querySnapshot = await getDocs(q);
      const babiesList = [];
      querySnapshot.forEach((doc) => {
        babiesList.push({ id: doc.id, ...doc.data() });
      });
      setBabies(babiesList);
    } catch (error) {
      console.error("Erro ao buscar bebês:", error);
    }
    setLoadingBabies(false);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }
    try {
      const docRef = doc(db, "maes", currentUserId);
      await updateDoc(docRef, {
        nome: nameInput.trim(),
      });
      setMotherData((prev) => ({ ...prev, nome: nameInput.trim() }));
      setEditingName(false);
      Alert.alert("Sucesso", "Nome atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    }
  };

  const handleAddBaby = async () => {
    if (!babyName.trim() || !babyBirthDate.trim() || !babyWeight.trim()) {
      Alert.alert("Erro", "Preencha todos os campos do bebê.");
      return;
    }

    try {
      await addDoc(collection(db, "bebes"), {
        maeId: currentUserId,
        nome: babyName.trim(),
        nascimento: babyBirthDate.trim(),
        pesoAtual: babyWeight.trim(),
      });

      setBabyName("");
      setBabyBirthDate("");
      setBabyWeight("");
      setModalVisible(false);
      fetchBabies();
      Alert.alert("Sucesso", "Bebê adicionado!");
    } catch (error) {
      console.error("Erro ao adicionar bebê:", error);
      Alert.alert("Erro", "Não foi possível adicionar o bebê.");
    }
  };

  if (!currentUserId) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#C31E65" />
      </View>
    );
  }

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

          {editingName ? (
            <>
              <TextInput
                style={[
                  styles.name,
                  { borderBottomWidth: 1, borderColor: "#C31E65", width: 220, textAlign: "center" },
                ]}
                value={nameInput}
                onChangeText={setNameInput}
                editable={editingName}
                autoFocus
              />
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <TouchableOpacity
                  onPress={handleSaveName}
                  style={[styles.editButton, { marginRight: 15 }]}
                >
                  <Text style={{ color: "#C31E65", fontWeight: "bold" }}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditingName(false);
                    setNameInput(motherData?.nome || "");
                  }}
                  style={styles.editButton}
                >
                  <Text style={{ color: "#888" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.name}>{motherData?.nome || "Carregando..."}</Text>
              <TouchableOpacity
                onPress={() => setEditingName(true)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="pencil" size={20} color="#C31E65" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.username}>@{motherData?.username || "carregando..."}</Text>
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

          {loadingBabies ? (
            <ActivityIndicator color="#C31E65" size="large" />
          ) : babies.length === 0 ? (
            <Text
              style={{
                color: "#666",
                fontStyle: "italic",
                marginVertical: 10,
                textAlign: "center",
              }}
            >
              Nenhum bebê cadastrado ainda.
            </Text>
          ) : (
            babies.map((baby) => (
              <View key={baby.id} style={styles.babyRow}>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Nome</Text>
                  <Text style={styles.value}>{baby.nome}</Text>
                </View>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Nascimento</Text>
                  <Text style={styles.value}>{baby.nascimento}</Text>
                </View>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Peso atual</Text>
                  <Text style={styles.value}>{baby.pesoAtual}</Text>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.addBabyButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#C31E65" />
            <Text style={styles.addBabyButtonText}>Adicionar novo bebê</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>dias como mãe</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>artigos lidos</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("ForumMother")}
          >
            <Ionicons name="people-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Comunidade de mães</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Daily")}
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

      <BottomNav navigation={navigation} activeScreen="ProfileMother" />

      {/* Modal para adicionar bebê */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Bebê</Text>

            <TextInput
              placeholder="Nome do bebê"
              value={babyName}
              onChangeText={setBabyName}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Data de nascimento (dd/mm/aaaa)"
              value={babyBirthDate}
              onChangeText={setBabyBirthDate}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Peso atual (ex: 5.2Kg)"
              value={babyWeight}
              onChangeText={setBabyWeight}
              style={styles.modalInput}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#C31E65" }]}
                onPress={handleAddBaby}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#C31E65",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 30,
    paddingVertical: 2,
    paddingHorizontal: 15,
    marginTop: 8,
  },
  tagText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 11,
  },
  cardWithShadow: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 10,
  },
  babyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  babyCardTitle: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  babyRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 15,
  },
  babyInfoBox: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    marginTop: 2,
  },
  addBabyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  addBabyButtonText: {
    color: "#C31E65",
    marginLeft: 5,
    fontWeight: "bold",
  },
  statsContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "45%",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 10,
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#C31E65",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  actionsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  actionText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});



