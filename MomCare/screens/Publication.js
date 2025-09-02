import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const publication = {
  id: "1",
  name: "Natália dos Santos",
  handle: "@nat.san.pasc",
  time: "5 min",
  message:
    "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
  date: "01/08/2025 - 13h28",
  avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  comments: [
    {
      id: "c1",
      name: "Natália dos Santos",
      handle: "@nat.san.pasc",
      time: "5 min",
      message:
        "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "c2",
      name: "Natália dos Santos",
      handle: "@nat.san.pasc",
      time: "5 min",
      message:
        "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "c3",
      name: "Natália dos Santos",
      handle: "@nat.san.pasc",
      time: "5 min",
      message:
        "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "c4",
      name: "Natália dos Santos",
      handle: "@nat.san.pasc",
      time: "5 min",
      message:
        "Alguém mais está tendo dificuldades para amamentar? Meu bebê não pega o peito direito, e estou super preocupada.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ],
};

export default function PublicationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#C31E65" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <Image source={{ uri: publication.avatar }} style={styles.avatar} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.name}>{publication.name}</Text>
              <Text style={styles.handle}>{publication.handle}</Text>
            </View>
            <Text style={styles.time}>{publication.time}</Text>
          </View>

          <Text style={styles.message}>{publication.message}</Text>

          <Text style={styles.date}>{publication.date}</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.commentsTitle}>Mais comentários</Text>

        {publication.comments.map((comment) => (
          <View key={comment.id} style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Image source={{ uri: comment.avatar }} style={styles.avatar} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.name}>{comment.name}</Text>
                <Text style={styles.handle}>{comment.handle}</Text>
              </View>
              <Text style={styles.time}>{comment.time}</Text>
            </View>
            <Text style={styles.commentMessage}>{comment.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  logo: {
    width: 60,
    height: 60,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  postContainer: {
    marginBottom: 2,
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
    backgroundColor: "#ccc",
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#C31E65",
  },

  handle: {
    fontSize: 13,
    color: "#C31E65",
  },

  time: {
    fontSize: 12,
    color: "#888",
  },

  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 6,
  },

  date: {
    fontSize: 12,
    color: "#888",
  },

  commentsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#C31E65",
    marginBottom: 16,
  },

  commentContainer: {
    marginBottom: 30, 
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  commentMessage: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  separator: {
    height: 1,
    backgroundColor: "#ddd", 
    marginVertical: 30, 
    marginHorizontal: -24, 
  },
});

