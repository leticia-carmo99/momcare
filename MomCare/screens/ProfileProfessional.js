import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavProfessional";

export default function ProfileProfessional({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.topHeader}>
          <View>
            <Text style={styles.topTitle}>Meu Perfil</Text>
            <Text style={styles.topSubtitle}>Gerencie suas informações</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
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
              <Text style={styles.name}>Natália dos Santos</Text>
              <Text style={styles.subInfo}>Pediatra - CRM 12345-SP</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>Neonatologia</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>dranat.santos@gmail.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>(11) 96276-7256</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color="#666" style={styles.icon} />
              <Text style={styles.contactText}>São Paulo, SP</Text>
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
});



