import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavMother";
import { doc, updateDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileMotherScreen({ navigation, route }) {
  const user = route?.params?.user;
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [baby, setBaby] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState(new Date());
  const [babyWeight, setBabyWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    } else {
      setName("");
    }
  }, [user]);

  useEffect(() => {
    // buscar dados do bebê associados à mãe
    async function fetchBaby() {
      try {
        const q = query(
          collection(db, "bebes"),
          where("userId", "==", user.id)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();
          setBaby({
            id: docSnap.id,
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            pesoAtual: data.pesoAtual,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar bebê:", err);
      }
    }

    if (user?.id) {
      fetchBaby();
    }
  }, [user]);

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

  async function saveName() {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome não pode ser vazio.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, "maes", user.id);
      await updateDoc(userDocRef, { name: name.trim() });

      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
      setIsEditing(false);
      // atualiza localmente
      user.name = name.trim();
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o nome. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  }

  function calcularIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const diff = hoje - nascimento;
    const dias = diff / (1000 * 60 * 60 * 24);
    const meses = Math.floor(dias / 30.44);
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    const diasRestantes = Math.floor(dias % 30.44);

    if (anos > 0) {
      return `${anos}a ${mesesRestantes}m`;
    } else {
      return `${meses}m ${diasRestantes}d`;
    }
  }

  function formatarData(data) {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  }

  async function salvarBebe() {
    if (!babyName.trim() || !babyWeight.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "bebes"), {
        userId: user.id,
        nome: babyName.trim(),
        dataNascimento: babyBirthDate.toISOString(),
        pesoAtual: babyWeight.trim(),
      });

      setBaby({
        id: docRef.id,
        nome: babyName.trim(),
        dataNascimento: babyBirthDate.toISOString(),
        pesoAtual: babyWeight.trim(),
      });

      setShowModal(false);
      setBabyName("");
      setBabyWeight("");
    } catch (err) {
      console.error("Erro ao salvar bebê:", err);
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
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

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  editable={!loading}
                  onSubmitEditing={saveName}
                  returnKeyType="done"
                />
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#C31E65"
                    style={{ marginLeft: 10 }}
                  />
                ) : (
                  <TouchableOpacity onPress={saveName} style={{ marginLeft: 10 }}>
                    <Ionicons name="checkmark" size={24} color="#C31E65" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    setName(user.name || "");
                  }}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="close" size={24} color="#C31E65" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>{name || "Insira seu nome"}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons name="pencil" size={20} color="#C31E65" />
                </TouchableOpacity>
              </>
            )}
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

          {baby ? (
            <>
              <View style={styles.babyRow}>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Nome</Text>
                  <Text style={styles.value}>{baby.nome}</Text>
                </View>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Idade</Text>
                  <Text style={styles.value}>
                    {calcularIdade(baby.dataNascimento)}
                  </Text>
                </View>
              </View>

              <View style={styles.babyRow}>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Nascimento</Text>
                  <Text style={styles.value}>
                    {formatarData(baby.dataNascimento)}
                  </Text>
                </View>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Peso atual</Text>
                  <Text style={styles.value}>{baby.pesoAtual} Kg</Text>
                </View>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addBabyButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.addBabyButtonText}>+ Adicionar bebê</Text>
            </TouchableOpacity>
          )}
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

      <Modal isVisible={showModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar bebê</Text>

          <TextInput
            placeholder="Nome do bebê"
            value={babyName}
            onChangeText={setBabyName}
            style={styles.modalInput}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.modalInput}
          >
            <Text style={{ color: "#C31E65" }}>
              Nascimento: {formatarData(babyBirthDate)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={babyBirthDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setBabyBirthDate(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            placeholder="Peso atual (Kg)"
            value={babyWeight}
            onChangeText={setBabyWeight}
            keyboardType="numeric"
            style={styles.modalInput}
          />

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={salvarBebe}>
              <Text style={styles.modalSaveText}>Salvar</Text>
            </TouchableOpacity>
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
    paddingBottom: 90,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
    borderBottomWidth: 1,
    borderColor: "#C31E65",
    paddingVertical: 2,
    minWidth: 150,
  },
  username: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#FFD6EC",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#C31E65",
  },
  tagText: {
    color: "#C31E65",
    fontSize: 13,
  },
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
  babyInfoBox: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  addBabyButton: {
    backgroundColor: "#FFD6EC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addBabyButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
  },
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
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C31E65",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
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
  actionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },

  // Modal styles
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F7E2EB",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C31E65",
    marginBottom: 12,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: "#C31E65",
    marginBottom: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalCancelText: {
    color: "#888",
    marginRight: 20,
    fontSize: 14,
  },
  modalSaveText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 14,
  },
});
