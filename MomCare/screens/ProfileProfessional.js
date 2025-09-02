import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavProfessional";

export default function ProfileProfessional({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require("../assets/fotoperfil.png")} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>Natália dos Santos</Text>
          <Text style={styles.username}>@nat.pediatra</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Pediatra</Text>
          </View>
        </View>

        <View style={styles.cardWithShadow}>
          <Text style={styles.infoTitle}>Informações do profissional</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>CRM</Text>
              <Text style={styles.value}>12345-SP</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Especialização</Text>
              <Text style={styles.value}>Neonatologia</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Anos atuando</Text>
              <Text style={styles.value}>5 anos</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Formação</Text>
              <Text style={styles.value}>Pediatria</Text>
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
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#555" />
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
  username: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#FFD6EC",
    paddingHorizontal: 40, 
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
  infoTitle: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
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
});
