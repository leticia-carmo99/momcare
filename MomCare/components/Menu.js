import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import fotoperfil from "../assets/fotoperfil.png"; 
import { useMother } from "../providers/MotherContext";

export default function Menu({ navigation }) {
  const { motherData } = useMother();
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={fotoperfil} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{motherData?.name || "Usuário"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileMother")}>
            <Text style={styles.viewProfile}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PublishedArticles")}>
        <Ionicons name="document-text-outline" size={20} color="#555" />
        <Text style={styles.menuText}>Artigos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("FavoriteArticles")}>
        <Ionicons name="heart-outline" size={20} color="#555" />
        <Text style={styles.menuText}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Exams")}>
        <Ionicons name="medkit-outline" size={20} color="#555" />
        <Text style={styles.menuText}>Leitura de Exames</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AboutUs")}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#555" />
        <Text style={styles.menuText}>Sobre o app</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="settings-outline" size={20} color="#555" />
        <Text style={styles.menuText}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 40,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  viewProfile: {
    color: "#C6266C",
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#555",
  },
});

