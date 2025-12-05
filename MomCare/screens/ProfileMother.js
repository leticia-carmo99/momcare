import React, { useState, useEffect, useCallback } from "react";
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
  Platform, 
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
  deleteDoc, 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useMother } from "../providers/MotherContext";

const CustomAlertModal = ({ isVisible, title, message, onConfirm, onCancel, confirmText = "OK", cancelText }) => (
  <Modal 
    isVisible={isVisible}
  >
    <View style={customStyles.modalOverlay}>
      <View style={customStyles.modalContainer}>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={customStyles.modalCloseButton}>
            <Ionicons name="close-circle-outline" size={30} color="#C31E65" />
          </TouchableOpacity>
        )}
        <Text style={customStyles.modalTitle}>{title}</Text>
        <Text style={customStyles.modalMessage}>{message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={customStyles.modalCancelButton}>
              <Text style={customStyles.modalCancelButtonText}>{cancelText || "Cancelar"}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onConfirm} style={[customStyles.modalOkButton, !onCancel && { flex: 1 }]}>
            <Text style={customStyles.modalOkButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const customStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%", 
    backgroundColor: "white",
    borderRadius: 20, 
    padding: 25,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
    borderWidth: 1,
    borderColor: "#FFD6EC",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#C31E65",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalOkButton: {
    backgroundColor: "#C31E65",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    minWidth: 100,
  },
  modalOkButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 100,
    borderColor: '#C31E65',
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: "#C31E65",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default function ProfileMotherScreen({ navigation, route }) {
const { motherData, updateMother } = useMother();


  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [babyList, setBabyList] = useState([]);
  const [isFirstTimeMom, setIsFirstTimeMom] = useState(true);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState(() => () => setAlertVisible(false));
  const [alertCancelAction, setAlertCancelAction] = useState(null);
  const [alertConfirmText, setAlertConfirmText] = useState("OK");
  const [alertCancelText, setAlertCancelText] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState(new Date());
  const [babyWeight, setBabyWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);
  const [editBabyName, setEditBabyName] = useState("");
  const [editBabyBirthDate, setEditBabyBirthDate] = useState(new Date());
  const [editBabyWeight, setEditBabyWeight] = useState("");
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  useEffect(() => {
  if (motherData?.name) {
  setName(motherData.name);
    } else {
      setName("");
    }
  }, [motherData]);

  const showCustomAlert = useCallback((title, message, onConfirm, onCancel = null, confirmText = "OK", cancelText = "Cancelar") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirmAction(() => () => {
      setAlertVisible(false);
      onConfirm && onConfirm();
    });
    setAlertCancelAction(onCancel ? () => () => {
      setAlertVisible(false);
      onCancel();
    } : null);
    setAlertConfirmText(confirmText);
    setAlertCancelText(cancelText);
    setAlertVisible(true);
  }, []);

  const fetchBabies = useCallback(async () => {
    try {
      if (!motherData?.id) return;

      const q = query(collection(db, "bebes"), where("userId", "==", motherData.id));

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const babies = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const sortedBabies = babies.sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));

        setBabyList(sortedBabies);
        setIsFirstTimeMom(sortedBabies.length === 1);
      } else {
        setBabyList([]);
        setIsFirstTimeMom(true);
      }
    } catch (err) {
      console.error("Erro ao buscar bebê:", err);
    }
  }, [motherData]);

  useEffect(() => {
    if (motherData?.id) {
      fetchBabies();
    }
  }, [motherData, fetchBabies]);

  if (!motherData) {
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
      const userDocRef = doc(db, "maes", motherData.id);
      await updateDoc(userDocRef, { name: name.trim() });

      showCustomAlert("Sucesso!", "Seu nome foi atualizado com sucesso!", () => {});
      setIsEditing(false);
      updateMother({ name: name.trim() });
    } 
    catch (error) {
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
    const diferencaMs = hoje - nascimento;
    
    const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
    
    const mesesTotais = Math.floor(diferencaDias / 30.44);

    const anos = Math.floor(mesesTotais / 12);
    const meses = mesesTotais % 12;
    
    let idadeTexto = "";

    if (anos > 0) {
        idadeTexto += `${anos} ${anos === 1 ? "ano" : "anos"}`;
        if (meses > 0) {
            idadeTexto += ` e ${meses} ${meses === 1 ? "mês" : "meses"}`;
        }
    } else if (meses > 0) {
        idadeTexto += `${meses} ${meses === 1 ? "mês" : "meses"}`;
        
        const diasRestantes = Math.floor(diferencaDias % 30.44);
        if (diasRestantes > 0) {
          idadeTexto += ` e ${diasRestantes} ${diasRestantes === 1 ? "dia" : "dias"}`;
        }
    } else {
        idadeTexto = `${diferencaDias} ${diferencaDias === 1 ? "dia" : "dias"}`;
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
        userId: motherData.id,
        usernameMae: motherData.username,
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

      const updatedList = [...babyList, novoBebe].sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
      setBabyList(updatedList);
      setIsFirstTimeMom(updatedList.length === 1);

      setShowModal(false);
      setBabyName("");
      setBabyWeight("");
      showCustomAlert("Sucesso!", "Novo bebê adicionado com sucesso!", () => {});
    } catch (err) {
      console.error("Erro ao salvar bebê:", err);
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  }

  function openEditModal(baby) {
    setEditingBaby(baby);
    setEditBabyName(baby.nome);
    setEditBabyBirthDate(new Date(baby.dataNascimento));
    setEditBabyWeight(baby.pesoAtual);
    setShowEditModal(true);
  }

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

      const updatedList = babyList.map(b =>
        b.id === editingBaby.id ? { ...b, ...updatedData } : b
      ).sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
      
      setBabyList(updatedList);

      showCustomAlert("Atualizado!", "Informações do bebê atualizadas com sucesso!", () => {});
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
  
  function confirmRemoveBaby() {
    setShowEditModal(false); 
    showCustomAlert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover o bebê ${editingBaby.nome}? Essa ação é irreversível e apagará todos os dados de registro relacionados.`,
      removeBabyAction,
      () => { setShowEditModal(true); },
      "Remover",
      "Cancelar"
    );
  }

  async function removeBabyAction() {
    try {
      if (!editingBaby?.id) {
        Alert.alert("Erro", "ID do bebê não encontrado.");
        return;
      }

      await deleteDoc(doc(db, "bebes", editingBaby.id));

      const updatedList = babyList.filter(b => b.id !== editingBaby.id)
                                  .sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
      
      setBabyList(updatedList);
      setIsFirstTimeMom(updatedList.length === 1);

      showCustomAlert("Removido!", `O bebê ${editingBaby.nome} foi removido com sucesso!`, () => {});
      setShowEditModal(false);
      setEditingBaby(null);
    } catch (error) {
      console.error("Erro ao remover bebê:", error);
      Alert.alert(
        "Erro",
        "Não foi possível remover o bebê. Tente novamente."
      );
    }
  }

  function formatWeightInput(text) {
    let cleanText = text.replace(/[^0-9.,]/g, "");
    cleanText = cleanText.replace(",", ".");
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      cleanText = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[0] && parts[0].length > 2) {
        cleanText = parts[0].substring(0, 2) + (parts[1] ? '.' + parts[1] : '');
    }
    if (parts[1] && parts[1].length > 2) {
        cleanText = parts[0] + '.' + parts[1].substring(0, 2);
    }
    return cleanText.replace('.', ',');
  }


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{uri: 'https://i.pinimg.com/736x/83/b0/7f/83b07fe79c4bdcc8e6c27f974c597842.jpg'}} style={styles.profileImage} />

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
                  setName(motherData.name || "");
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

          <Text style={styles.username}>@{motherData.username}</Text>
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

        <TouchableOpacity
          style={[styles.addBabyButton, {
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#C31E65",
            marginTop: 5, 
            marginBottom: 10, 
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
            <Text style={styles.statNumber}>{motherData.articlesRead || 47}</Text>
            <Text style={styles.statLabel}>artigos lidos</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("ForumMother", { user: motherData })}

          >
            <Ionicons name="people-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Comunidade de mães</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Daily", { user: motherData })}
          >
            <MaterialCommunityIcons name="notebook-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Diário da mamãe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="ProfileMother" user={motherData} />

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
              setBabyWeight(formatWeightInput(text)) 
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
              setEditBabyWeight(formatWeightInput(text)) 
            }
            keyboardType="numeric"
            style={styles.modalInput}
          />
            
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity onPress={confirmRemoveBaby}>
              <Text style={styles.modalRemoveText}>Remover Bebê</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setShowEditModal(false)} style={{ marginRight: 20 }}>
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveBabyEdit}>
                    <Text style={styles.modalSaveText}>Salvar</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlertModal
        isVisible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertConfirmAction}
        onCancel={alertCancelAction}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
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
  
  editIconContainer: {
    alignItems: 'flex-end', 
    marginTop: -5, 
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
    justifyContent: "space-between", 
    marginTop: 15,
  },
  modalCancelText: {
    color: "#888",
    fontSize: 14,
  },
  modalSaveText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 14,
  },
  
  modalRemoveText: {
    color: '#C31E65',
    fontSize: 14,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  }
});