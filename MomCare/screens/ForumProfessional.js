import React from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavProfessional";
import FotoArtigo from "../assets/fotoartigo.png";

const posts = [
  {
    id: "1",
    name: "Natália dos Santos",
    handle: "@nat.san.pasc",
    time: "5 min",
    message:
      "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
    date: "01/08/2025 - 13h28",
    comments: 23,
    likes: 32,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    image: null,
  },
  {
    id: "2",
    name: "Mayara Almeida",
    handle: "@maymay",
    time: "10 min",
    message:
      "Sou médica e mãe de dois filhos. Percebi que muitas mamães têm dificuldades com a introdução alimentar, por isso resolvi escrever sobre como tornar essa fase mais tranquila e segura. Clique aqui embaixo para saber mais e tirar suas dúvidas!",
    date: "01/08/2025 - 13h28",
    comments: 0,
    likes: 0,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "local",
  },
  {
    id: "3",
    name: "Verônica de Oliveira",
    handle: "@veta.2007",
    time: "10 min",
    message: "Alguém tem dicas de como fazer o bebê arrotar? Ele está com gases.",
    date: "01/08/2025 - 13h28",
    comments: 12,
    likes: 20,
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
    image: null,
  },
  {
    id: "4",
    name: "Ana Costa",
    handle: "@ana.costa",
    time: "20 min",
    message:
      "Meu bebê tem tido cólicas frequentemente e eu estou bem preocupada. Alguém tem alguma dica para ajudar?",
    date: "01/08/2025 - 14h00",
    comments: 5,
    likes: 8,
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    image: null,
  },
  {
    id: "5",
    name: "Joana Silva",
    handle: "@joana.silva",
    time: "30 min",
    message:
      "Alguém mais tem dificuldades para fazer o bebê dormir a noite? Estou ficando exausta tentando estabelecer uma rotina.",
    date: "01/08/2025 - 14h10",
    comments: 7,
    likes: 15,
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    image: null, 
  },
];

export default function ForumProfessional({ navigation }) {
  const renderItem = ({ item }) => {
    const PostContent = (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.handle, { color: "#C31E65" }]}>{item.handle}</Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <Text style={styles.message}>{item.message}</Text>

        {item.image && (
          <TouchableOpacity
            style={styles.postImageContainer}
            onPress={() => navigation.navigate("Article")}
            activeOpacity={0.8}
          >
            <Image
              source={item.image === "local" ? FotoArtigo : { uri: item.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.imageDescription}>
              <Text style={[styles.imageTitle, { color: "#000" }]}>
                Introdução alimentar
              </Text>
              <Text style={styles.imageAuthor}>Dra. Mayara Almeida de Campos</Text>
              <Text style={styles.imageInfo}>
                Passo a passo para uma introdução alimentar sem estresse: Dicas práticas
                e seguras para você e seu bebê.
              </Text>
              <Text style={styles.imageDate}>01/08/2025</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.date}>{item.date}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#888" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="thumbs-up-outline" size={16} color="#888" />
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />
      </View>
    );

    if (item.id === "1") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Publication")}
        >
          {PostContent}
        </TouchableOpacity>
      );
    }

    return PostContent;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerTitle}>Fórum</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#C31E65"
              style={{ marginHorizontal: 10 }}
            />
            <TextInput
              placeholder="Pesquisar"
              placeholderTextColor="#D9A7C7"
              style={styles.searchInput}
            />
          </View>
        }
      />

      <BottomNav navigation={navigation} activeScreen="ForumProfessional" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#C31E65",
    textAlign: "center",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    marginHorizontal: 24,
    borderRadius: 30,
    paddingVertical: 8,
    marginBottom: 10,
    shadowColor: "#aaa",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#F9C8D3",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#C31E65",
  },
  postContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginBottom: 0,
    paddingVertical: 14,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#C31E65",
  },
  handle: {
    fontSize: 13,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: "#888",
    flex: 1,
    textAlign: "left",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#888",
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  postImageContainer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
  postImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageDescription: {
    marginTop: 6,
  },
  imageTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  imageAuthor: {
    fontWeight: "600",
    color: "#C31E65",
    fontSize: 12,
    marginBottom: 2,
  },
  imageInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  imageDate: {
    fontSize: 10,
    color: "#999",
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 10,
    marginHorizontal: -20,
  },
});
