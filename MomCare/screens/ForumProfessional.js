import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavProfessional";
import FotoArtigo from "../assets/fotoartigo.png";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useProfessional } from "../providers/ProfessionalContext";

async function getAutorData(userId) {
  if (!userId) return null;

  const maeRef = doc(db, "maes", userId);
  const maeSnap = await getDoc(maeRef);
  if (maeSnap.exists()) {
    return {
      tipo: "mae",
      ...maeSnap.data(),
      id: maeSnap.id
    };
  }

  const profRef = doc(db, "profissionais", userId);
  const profSnap = await getDoc(profRef);
  if (profSnap.exists()) {
    return {
      tipo: "profissional",
      ...profSnap.data(),
      id: profSnap.id
    };
  }

  return null; 
}


function normalizeAvatar(avatar) {
  if (!avatar)
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSnx4pDeEoWy95h-dyBYcyYEgOUHaYXBKpA&usqp=CAU";
  if (typeof avatar === "object" && avatar?.uri) return avatar.uri;
  if (typeof avatar === "string") return avatar;
  return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSnx4pDeEoWy95h-dyBYcyYEgOUHaYXBKpA&usqp=CAU";
}

export default function ForumProfessional({ navigation }) {
  const { professionalData } = useProfessional();
  const [postsState, setPostsState] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postCollectionRef = collection(db, 'forum');
        const snapshot = await getDocs(postCollectionRef);

        const fetchedPosts = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const comentariosRef = collection(db, "forum", docSnap.id, "comentarios");
          const comentariosSnap = await getDocs(comentariosRef);
          const autorInfo = await getAutorData(data.id_autor);
          const totalCurtidas = data.curtidas ? data.curtidas.length : 0;
          const totalComentarios = comentariosSnap.size;
          
          return {
            id: docSnap.id,
            autor: autorInfo?.name ?? data.autor ?? "Usuário",
            email: autorInfo?.email ?? data.email_autor,
            avatar: normalizeAvatar(autorInfo?.avatar ?? data.avatar),
            conteudo: data.conteudo,
            curtidas: totalCurtidas,
            curtidasLista: data.curtidas ?? [],
            comentarios: totalComentarios,
            data: data.data,
            idAutor: data.id_autor ?? "Usuário",
            tempo: data.tempo ?? "5 min",
            titulo: data.titulo ?? "Sem descrição",
          };
        })
      );

        setPostsState(fetchedPosts);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

async function toggleCurtida(postId, curtidasAtuais) {
  try {
    const postRef = doc(db, "forum", postId);
    const jaCurtiu = curtidasAtuais.includes(professionalData.id);

    if (jaCurtiu) {
      await updateDoc(postRef, {
        curtidas: arrayRemove(professionalData.id)
      });

      setPostsState(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, curtidas: post.curtidas - 1, curtidasLista: curtidasAtuais.filter(id => id !== professionalData.id) }
            : post
        )
      );
    } else {
      await updateDoc(postRef, {
        curtidas: arrayUnion(professionalData.id)
      });

      setPostsState(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, curtidas: post.curtidas + 1, curtidasLista: [...curtidasAtuais, professionalData.id] }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Erro ao curtir:", error);
  }
}


  const renderItem = ({ item }) => {
    const fotoAvatar = typeof item.avatar === 'string' && item.avatar.startsWith('http') 
        ? { uri: item.avatar } 
        : item.avatar; 
    const postHeader = (
        <View style={styles.postHeader}>
          <Image source={fotoAvatar} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{item.autor}</Text>
            <Text style={[styles.handle, { color: "#C31E65" }]}>
              {item.email}
            </Text>
          </View>
          <Text style={styles.time}>{item.tempo}</Text>
        </View>
      );

    const PostContent = (
      <View style={styles.postContainer}>
        {postHeader}

        <Text style={styles.message}>{item.conteudo}</Text>

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
          <Text style={styles.date}>{item.data}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#888" />
              <Text style={styles.actionText}>{item.comentarios}</Text>
            </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleCurtida(item.id, item.curtidasLista)}
              >
                <Ionicons
                  name={
                    item.curtidasLista.includes(professionalData.id)
                      ? "thumbs-up"
                      : "thumbs-up-outline"
                  }
                  size={16}
                  color={item.curtidasLista.includes(professionalData.id) ? "#C31E65" : "#888"}
                />
                <Text style={styles.actionText}>{item.curtidas}</Text>
              </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />
      </View>
    );

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => 
                navigation.navigate('CommonStack', {
                screen: 'Publication',
                params: { postId: item.id }
              })
            }>
          {PostContent}
        </TouchableOpacity>
      );
    

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
        data={postsState}
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

      <BottomNav navigation={navigation} activeScreen="ForumMother" />
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
