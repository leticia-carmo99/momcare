import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRoute } from '@react-navigation/native';

async function getAutorData(userId) {
  if (!userId) return null;

  const maeRef = doc(db, "maes", userId);
  const maeSnap = await getDoc(maeRef);
  if (maeSnap.exists()) {
    return { tipo: "mae", ...maeSnap.data(), id: maeSnap.id };
  }

  const profRef = doc(db, "profissionais", userId);
  const profSnap = await getDoc(profRef);
  if (profSnap.exists()) {
    return { tipo: "profissional", ...profSnap.data(), id: profSnap.id };
  }

  return null;
}

export default function Publication({ navigation }) {
  const route = useRoute();
  const { postId } = route.params || {}; 
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (!postId) return;

    const fetchDetails = async () => {
      try {
        const postRef = doc(db, "forum", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          console.log("Post não encontrado");
          setIsLoading(false);
          return;
        }

        const data = postSnap.data();

        const autorInfo = await getAutorData(data.id_autor);

        setPostData({
          ...data,
          autor: autorInfo?.name ?? data.autor ?? "Usuário",
          email: autorInfo?.email ?? data.email_autor,
          avatar:
            autorInfo?.avatar ??
            data.avatar ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3jhpAFYpzxx39DRuXIYxNPXc0zI5F6IiMQ&s",
        });

        const comentariosRef = collection(db, "forum", postId, "comentarios");
        const comentariosSnap = await getDocs(comentariosRef);

        const comentariosComAutor = await Promise.all(
          comentariosSnap.docs.map(async (c) => {
            const cData = c.data();
            const autorC = await getAutorData(cData.id_autor);

            return {
              id: c.id,
              conteudo: cData.conteudo,
              tempo: cData.tempo ?? "Agora",
              autor: autorC?.name ?? cData.autor,
              email: autorC?.email ?? cData.email_autor,
              avatar:
                autorC?.avatar ??
                cData.avatar ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3jhpAFYpzxx39DRuXIYxNPXc0zI5F6IiMQ&s",
            };
          })
        );

        setComentarios(comentariosComAutor);
      } catch (err) {
        console.error("Erro ao buscar publicação:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [postId]);

const fotoAvatar = postData?.avatar
  ? (typeof postData.avatar === 'string' && postData.avatar.startsWith('http')
      ? { uri: postData.avatar }
      : postData.avatar)
  : { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3jhpAFYpzxx39DRuXIYxNPXc0zI5F6IiMQ&s" };


  if (isLoading || !postData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C31E65" />
      </View>
    );
  }

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
            <Image source={fotoAvatar} style={styles.avatar} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.name}>{postData.autor}</Text>
              <Text style={styles.handle}>{postData.email}</Text>
            </View>
            <Text style={styles.time}>{postData.tempo}</Text>
          </View>

          <Text style={styles.message}>{postData.conteudo}</Text>

          <Text style={styles.date}>{postData.data}</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.commentsTitle}>Mais comentários</Text>

{comentarios.map((comment) => {

  const avatarComentario =
    typeof comment.avatar === "string" && comment.avatar.startsWith("http")
      ? { uri: comment.avatar }
      : comment.avatar;
      return (
          <View key={comment.id} style={styles.commentContainer}>
            <View style={styles.commentHeader}>
              <Image source={avatarComentario} style={styles.avatar} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.name}>{comment.autor}</Text>
                <Text style={styles.handle}>{comment.email}</Text>
              </View>
              <Text style={styles.time}>{comment.tempo}</Text>
            </View>
            <Text style={styles.commentMessage}>{comment.conteudo}</Text>
          </View>
  );
})}
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

