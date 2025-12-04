import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavProfessional";
import { useProfessional } from "../providers/ProfessionalContext";
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

const EditProfileModal = ({ 
  isVisible, 
  onCancel, 
  onSave, 
  loading, 
  name, setName, 
  crm, setCrm, 
  specialty, setSpecialty, 
  phone, setPhone, 
  address, setAddress 
}) => (
  <Modal 
    isVisible={isVisible}
    onBackdropPress={onCancel} 
    style={customStyles.modalOverlay} 
    animationIn="slideInUp"
    animationOut="slideOutDown"
  >
    <View style={customStyles.modalContainer}>
      <TouchableOpacity onPress={onCancel} style={customStyles.modalCloseButton}>
        <Ionicons name="close-circle-outline" size={30} color="#C31E65" />
      </TouchableOpacity>

      <Text style={customStyles.modalTitle}>Editar Perfil</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} /> 

        <Text style={styles.label}>Especialidade</Text>
        <TextInput style={styles.input} value={specialty} onChangeText={setSpecialty} placeholder="Ex: Pediatra" />

        <Text style={styles.label}>CRM (com estado)</Text>
        <TextInput style={styles.input} value={crm} onChangeText={setCrm} placeholder="Ex: 12345-SP" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Cidade/Estado</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ex: São Paulo, SP" />
      </ScrollView>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        paddingHorizontal: 10, 
        paddingTop: 10
      }}>
        <TouchableOpacity onPress={onCancel} style={customStyles.modalCancelButton}>
          <Text style={customStyles.modalCancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} style={customStyles.modalOkButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={customStyles.modalOkButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const customStyles = StyleSheet.create({
modalOverlay: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C31E65",
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
  },
  modalOkButton: {
    flex: 1,
    backgroundColor: "#C31E65",
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalOkButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


export default function ProfileProfessional({ navigation }) {
  const { professionalData, updateProfessional } = useProfessional();
    const [name, setName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [crm, setCrm] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState(() => () => {});
  const [alertCancelAction, setAlertCancelAction] = useState(null);
  const [alertConfirmText, setAlertConfirmText] = useState("OK");
  const [alertCancelText, setAlertCancelText] = useState("Cancelar");

useEffect(() => {
    if (professionalData) {
      setName(professionalData.name || "");
      setCrm(professionalData.crm || "");
      setSpecialty(professionalData.especialidade || "Especialista");
      setPhone(professionalData.telefone || "");
      setAddress(professionalData.endereco || "São Paulo, SP");
    }
  }, [professionalData]);

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

      async function saveName() {
        if (!name.trim()) {
          Alert.alert("Erro", "O nome não pode ser vazio.");
          return;
        }
    
        setLoading(true);
        try {
          const userDocRef = doc(db, "profissionais", professionalData.id);
          await updateDoc(userDocRef, { name: name.trim() });
    
          showCustomAlert("Sucesso!", "Seu nome foi atualizado com sucesso!", () => {});
          setIsEditing(false);
          updateProfessional({ name: name.trim() });
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

      async function handleSaveProfile() {
    setLoading(true);
    try {
      const updates = {
        name: name.trim(),
        crm: crm.trim(),
        especialidade: specialty.trim(),
        telefone: phone.trim(),
        endereco: address.trim(),
      };

      const userDocRef = doc(db, "profissionais", professionalData.id);
      await updateDoc(userDocRef, updates);
      updateProfessional(updates);
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.topHeader}>
          <View>
            <Text style={styles.topTitle}>Meu Perfil</Text>
            <Text style={styles.topSubtitle}>Gerencie suas informações</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={require("../assets/fotoperfil.png")}
              style={styles.profileImage}
            />
          
            <View style={styles.profileInfo}>
              <View style={{ flexDirection: "row" }}>
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
                  setName(professionalData.name || "");
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
              <Text style={styles.subInfo}>{professionalData.profissao || "Profissão"} - CRM: {professionalData.crm || "---"}</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{professionalData.especialidade || "Especialidade"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>{professionalData.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>{professionalData.telefone || "Telefone não informado"}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>{professionalData.endereco || "Endereço não informado"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>artigos publicados</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>+500</Text>
            <Text style={styles.statLabel}>mães ajudadas</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>

          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("ForumProfessional")}>
            <Ionicons name="people-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Comunidade de mães</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("RecentArticles")}>
            <MaterialCommunityIcons name="book-outline" size={24} color="#555" />
            <Text style={styles.actionText}>Artigos publicados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


        <EditProfileModal
        isVisible={modalVisible}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveProfile}
        name={name}
        setName={setName}
        crm={crm}
        setCrm={setCrm}
        specialty={specialty}
        setSpecialty={setSpecialty}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertConfirmAction}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />

      <BottomNav navigation={navigation} activeScreen="ProfileProfessional" />
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
  topHeader: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  topSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#C31E65",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#C31E65",
    fontSize: 13,
    fontWeight: "bold",
  },
  profileCard: {
    backgroundColor: "#FFECF7",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F7E2EB",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  subInfo: {
    fontSize: 13,
    color: "#555",
  },
  specialtyBadge: {
    backgroundColor: "#C31E65",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  specialtyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  contactInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#FAD0E5",
    paddingTop: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 12,
    color: "#666",
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
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 5,
    color: '#333',
},
input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 10, 
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
},
modalScroll: { 
    maxHeight: '75%',
    paddingHorizontal: 10, 
},
});



