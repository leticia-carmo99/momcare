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
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileMotherScreen({ navigation, route }) {
  const user = route?.params?.user;
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [babyList, setBabyList] = useState([]);
  const [isFirstTimeMom, setIsFirstTimeMom] = useState(true);

  // Estados para o Modal de ADICIONAR
  const [showModal, setShowModal] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState(new Date());
  const [babyWeight, setBabyWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para o Modal de EDITAR
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);
  const [editBabyName, setEditBabyName] = useState("");
  const [editBabyBirthDate, setEditBabyBirthDate] = useState(new Date());
  const [editBabyWeight, setEditBabyWeight] = useState("");
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    } else {
      setName("");
    }
  }, [user]);

  // Função para buscar os bebês
  async function fetchBabies() {
    try {
      const q = query(collection(db, "bebes"), where("userId", "==", user.id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const babies = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setBabyList(babies);
        setIsFirstTimeMom(babies.length === 1);
      } else {
        setBabyList([]);
        setIsFirstTimeMom(true);
      }
    } catch (err) {
      console.error("Erro ao buscar bebê:", err);
    }
  }

  useEffect(() => {
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
    const umDia = 1000 * 60 * 60 * 24;
    const diferencaDias = Math.floor((hoje - nascimento) / umDia);

    const meses = Math.floor(diferencaDias / 30.44);
    const dias = Math.floor(diferencaDias % 30.44);

    let idadeTexto = "";

    if (meses > 0) {
      idadeTexto += `${meses} ${meses === 1 ? "mês" : "meses"}`;
    }

    if (dias > 0 && meses > 0) {
      idadeTexto += ` e `;
    }

    if (dias > 0) {
      idadeTexto += `${dias} ${dias === 1 ? "dia" : "dias"}`;
    }

    return idadeTexto || "0 dias";
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
        nomeMae: user.name,
        nome: babyName.trim(),
        dataNascimento: babyBirthDate.toISOString(),
        pesoAtual: babyWeight.trim(),
      });

      const novoBebe = {
        id: docRef.id,
        nome: babyName.trim(),
        dataNascimento: babyBirthDate.toISOString(),
        pesoAtual: babyWeight.trim(),
      };

      setBabyList([...babyList, novoBebe]);
      setIsFirstTimeMom(babyList.length + 1 === 1);

      setShowModal(false);
      setBabyName("");
      setBabyWeight("");
    } catch (err) {
      console.error("Erro ao salvar bebê:", err);
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  }

  // Função para abrir o modal de edição
  function openEditModal(baby) {
    setEditingBaby(baby);
    setEditBabyName(baby.nome);
    setEditBabyBirthDate(new Date(baby.dataNascimento));
    setEditBabyWeight(baby.pesoAtual);
    setShowEditModal(true);
  }

  // Função para salvar as edições do bebê
  async function saveBabyEdit() {
    if (!editBabyName.trim() || !editBabyWeight.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!editingBaby?.id) {
      Alert.alert("Erro", "ID do bebê não encontrado para edição.");
      return;
    }

    try {
      const babyDocRef = doc(db, "bebes", editingBaby.id);
      const updatedData = {
        nome: editBabyName.trim(),
        dataNascimento: editBabyBirthDate.toISOString(),
        pesoAtual: editBabyWeight.trim(),
      };

      await updateDoc(babyDocRef, updatedData);

      // Atualiza a lista local
      setBabyList(prevList => prevList.map(b =>
        b.id === editingBaby.id ? { ...b, ...updatedData } : b
      ));

      Alert.alert("Sucesso", "Informações do bebê atualizadas!");
      setShowEditModal(false);
      setEditingBaby(null);
    } catch (error) {
      console.error("Erro ao atualizar bebê:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar as informações. Tente novamente."
      );
    }
  }

  // Função para garantir que o peso tenha no máximo dois dígitos (antes ou depois da vírgula)
  function formatWeightInput(text) {
    // Remove tudo que não for número, ponto ou vírgula
    let cleanText = text.replace(/[^0-9.,]/g, "");

    // Substitui vírgula por ponto para simplificar a lógica
    cleanText = cleanText.replace(",", ".");

    // Se tiver mais de um ponto, mantém apenas o primeiro
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      cleanText = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limita a 2 dígitos na parte inteira
    if (parts[0] && parts[0].length > 2) {
        cleanText = parts[0].substring(0, 2) + (parts[1] ? '.' + parts[1] : '');
    }

    // Limita a 2 dígitos na parte decimal
    if (parts[1] && parts[1].length > 2) {
        cleanText = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Volta para vírgula
    return cleanText.replace('.', ',');
  }


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require("../assets/fotoperfil.png")} style={styles.profileImage} />

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
                  <ActivityIndicator size="small" color="#C31E65" style={{ marginLeft: 10 }} />
                ) : (
                  <TouchableOpacity onPress={saveName} style={{ marginLeft: 10 }}>
                    <Ionicons name="checkmark" size={24} color="#C31E65" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => {
                  setIsEditing(false);
                  setName(user.name || "");
                }} style={{ marginLeft: 10 }}>
                  <Ionicons name="close" size={24} color="#C31E65" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>{name || "Insira seu nome"}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={{ marginLeft: 8 }}>
                  <Ionicons name="pencil" size={20} color="#C31E65" />
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.username}>@{user.username}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {isFirstTimeMom ? "Mãe de primeira viagem" : "Mamãe experiente"}
            </Text>
          </View>
        </View>

        {babyList.map((baby, index) => (
          <View key={baby.id || index} style={styles.cardWithShadow}>
            <View style={styles.babyHeader}>
              <MaterialCommunityIcons name="baby-bottle-outline" size={22} color="#C31E65" />
              <Text style={styles.babyCardTitle}>Informações do bebê {babyList.length > 1 ? `(${index + 1})` : ''}</Text>
            </View>

            <View>
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
                  <Text style={styles.value}>
                    {formatarData(baby.dataNascimento)}
                  </Text>
                </View>
                <View style={styles.babyInfoBox}>
                  <Text style={styles.label}>Peso atual</Text>
                  <Text style={styles.value}>{baby.pesoAtual} kg</Text>
                </View>
              </View>
              
              <View style={styles.editIconContainer}>
                <TouchableOpacity onPress={() => openEditModal(baby)}>
                  <Ionicons name="pencil-outline" size={20} color="#C31E65" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Botão para adicionar bebê sempre presente fora dos cards individuais */}
        <TouchableOpacity
          style={[styles.addBabyButton, {
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#C31E65",
            marginTop: 12,
            marginBottom: 25, // Adicionado margin aqui para separar das estatísticas
            marginHorizontal: 20, 
          }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={[styles.addBabyButtonText, { color: "#C31E65" }]}>
            + Adicionar bebê
          </Text>
        </TouchableOpacity>


        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {babyList.length > 0 ? Math.floor((new Date() - new Date(babyList[0].dataNascimento)) / (1000 * 60 * 60 * 24)) : 0}
            </Text>
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
            <MaterialCommunityIcons name="notebook-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Diário da mamãe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="ProfileMother" user={user} />

      {/* MODAL PARA ADICIONAR NOVO BEBÊ */}
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
            <Text style={{ color: "#000" }}> 
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
            onChangeText={(text) =>
              setBabyWeight(formatWeightInput(text)) // Usando a função para formatar/limitar
            }
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

      {/* MODAL PARA EDITAR BEBÊ EXISTENTE */}
      <Modal isVisible={showEditModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar bebê</Text>

          <TextInput
            placeholder="Nome do bebê"
            value={editBabyName}
            onChangeText={setEditBabyName}
            style={styles.modalInput}
          />

          <TouchableOpacity
            onPress={() => setShowEditDatePicker(true)}
            style={styles.modalInput}
          >
            <Text style={{ color: "#000" }}> 
              Nascimento: {formatarData(editBabyBirthDate)}
            </Text>
          </TouchableOpacity>

          {showEditDatePicker && (
            <DateTimePicker
              value={editBabyBirthDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEditDatePicker(false);
                if (selectedDate) setEditBabyBirthDate(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            placeholder="Peso atual (Kg)"
            value={editBabyWeight}
            onChangeText={(text) =>
              setEditBabyWeight(formatWeightInput(text)) // Usando a função para formatar/limitar
            }
            keyboardType="numeric"
            style={styles.modalInput}
          />

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveBabyEdit}>
              <Text style={styles.modalSaveText}>Salvar</Text>
            </TouchableOpacity>
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
  profileImage: { width: 130, height: 130, borderRadius: 65, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold", color: "#C31E65" },
  nameInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
    borderBottomWidth: 1,
    borderColor: "#C31E65",
    paddingVertical: 2,
    minWidth: 150,
  },
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
  babyHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
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
  
  // Novo estilo para o ícone de edição no card do bebê
  editIconContainer: {
    alignItems: 'flex-end', 
    marginTop: -5, // Puxa para cima para ficar no canto
  },
  
  addBabyButton: {
    backgroundColor: "#FFD6EC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addBabyButtonText: { color: "#C31E65", fontWeight: "bold" },
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
