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

  const [babies, setBabies] = useState([]);
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
    async function fetchBabies() {
      try {
        const q = query(
          collection(db, "bebes"),
          where("userId", "==", user.id)
        );
        const snapshot = await getDocs(q);
        const babiesList = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          babiesList.push({
            id: docSnap.id,
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            pesoAtual: data.pesoAtual,
          });
        });
        setBabies(babiesList);
      } catch (err) {
        console.error("Erro ao buscar bebês:", err);
      }
    }

    if (user?.id) {
      fetchBabies();
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

    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    let dias = hoje.getDate() - nascimento.getDate();

    if (dias < 0) {
      meses--;
      dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
    }
    if (meses < 0) {
      anos--;
      meses += 12;
    }

    let idadeStr = "";
    if (anos > 0) {
      idadeStr += `${anos} ${anos === 1 ? "ano" : "anos"}`;
    }
    if (meses > 0) {
      if (idadeStr) idadeStr += " ";
      idadeStr += `${meses} ${meses === 1 ? "mês" : "meses"}`;
    }

    if (!idadeStr) {
      idadeStr = "0 meses";
    }

    return idadeStr;
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

      // Atualiza lista localmente para exibir o novo bebê sem recarregar
      setBabies(prev => [
        ...prev,
        {
          id: docRef.id,
          nome: babyName.trim(),
          dataNascimento: babyBirthDate.toISOString(),
          pesoAtual: babyWeight.trim(),
        },
      ]);

      setShowModal(false);
      setBabyName("");
      setBabyWeight("");
      setBabyBirthDate(new Date());
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

          {babies.length > 0 ? (
            babies.map((baby) => (
              <View key={baby.id} style={styles.babyCard}>
                <View style={styles.babyRow}>
                  <View style={styles.babyInfoBox}>
                    <Text style={styles.label}>Nome</Text>
                    <Text style={styles.value}>{baby.nome}</Text>
                  </View>
                  <View style={styles.babyInfoBox}>
                    <Text style={styles.label}>Idade</Text>
                    <Text style={styles.value}>{calcularIdade(baby.dataNascimento)}</Text>
                  </View>
                </View>

                <View style={styles.babyRow}>
                  <View style={styles.babyInfoBox}>
                    <Text style={styles.label}>Nascimento</Text>
                    <Text style={styles.value}>{formatarData(baby.dataNascimento)}</Text>
                  </View>
                  <View style={styles.babyInfoBox}>
                    <Text style={styles.label}>Peso atual</Text>
                    <Text style={styles.value}>{baby.pesoAtual} kg</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "#999", marginVertical: 10 }}>
              Nenhum bebê cadastrado
            </Text>
          )}

          <TouchableOpacity
            style={styles.addBabyButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addBabyButtonText}>+ Adicionar bebê</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" navigation={navigation} />

      {/* Modal para adicionar bebê */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
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
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              Data de nascimento: {formatarData(babyBirthDate)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={babyBirthDate}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setBabyBirthDate(selectedDate);
                }
              }}
            />
          )}

          <TextInput
            placeholder="Peso atual (kg)"
            value={babyWeight}
            onChangeText={(text) => {
              // aceitar apenas números e ponto, até 3 caracteres (ex: 9.5 ou 12)
              const newText = text.replace(/[^0-9.]/g, '').slice(0, 4);
              setBabyWeight(newText);
            }}
            keyboardType="numeric"
            style={styles.modalInput}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setBabyName("");
                setBabyWeight("");
                setBabyBirthDate(new Date());
              }}
              style={[styles.modalButton, styles.cancelButton]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={salvarBebe}
              style={[styles.modalButton, styles.saveButton]}
            >
              <Text style={[styles.modalButtonText, { color: "#fff" }]}>Salvar</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },

  header: {
    marginBottom: 20,
    alignItems: "center",
  },

  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C31E65",
  },

  nameInput: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C31E65",
    borderBottomWidth: 1,
    borderBottomColor: "#C31E65",
    minWidth: 150,
  },

  username: {
    color: "#C31E65",
    marginTop: 4,
  },

  tag: {
    backgroundColor: "#FDE8F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },

  tagText: {
    color: "#C31E65",
    fontWeight: "bold",
  },

  cardWithShadow: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },

  babyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  babyCardTitle: {
    color: "#C31E65",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },

  babyCard: {
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  babyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  babyInfoBox: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: "#C31E65",
    fontWeight: "bold",
  },

  value: {
    fontSize: 16,
    color: "#C31E65",
  },

  addBabyButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#C31E65",
  },

  addBabyButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
    marginBottom: 15,
    textAlign: "center",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#C31E65",
    marginBottom: 15,
  },

  datePickerButton: {
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    justifyContent: "center",
  },

  datePickerText: {
    color: "#C31E65",
    fontSize: 16,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#C31E65",
    marginRight: 10,
  },

  saveButton: {
    backgroundColor: "#C31E65",
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C31E65",
  },
});
