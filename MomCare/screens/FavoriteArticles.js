import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useMother } from "../providers/MotherContext";
import { 
  collection, query, where, getDocs, orderBy 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function FavoriteArticles({ navigation }) {
  const { motherData } = useMother();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [favoriteArticles, setFavoriteArticles] = useState([]);

  const categories = [
  { id: "all", label: "Todos", icon: "book-open-outline", count: 156 },
  { id: "care", label: "Cuidados", icon: "emoticon-happy-outline", count: 23 },
  { id: "food", label: "Alimentação", icon: "silverware-fork-knife", count: 34 },
  { id: "sleep", label: "Sono", icon: "weather-night", count: 41 },
  { id: "development", label: "Desenvolvimento", icon: "baby", count: 32 },
  { id: "health", label: "Saúde", icon: "heart-pulse", count: 12 },
];


   useEffect(() => {
    async function loadFavorites() {
      try {
        if (!motherData?.id) return;

        const articlesRef = collection(db, "artigos");
        const q = query(
          articlesRef,
          where("curtidas", "array-contains", motherData.id)
        );

        const querySnap = await getDocs(q);

        const list = [];
        querySnap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            ...data,
            likesList: data.curtidas || [],
            likes: data.curtidas?.length || 0,
          });
        });

        setFavoriteArticles(list);
      } catch (e) {
        console.log("Erro ao carregar curtidos:", e);
      }
    }

    loadFavorites();
  }, [motherData]);

   const getFilteredArticles = () => {
    let filtered = [...favoriteArticles];

    if (searchText.trim() !== "") {
      const text = searchText.toLowerCase();
      filtered = filtered.filter((art) =>
    art.titulo?.toLowerCase().includes(text)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((art) =>
art.tags?.some(t => t.toLowerCase() === selectedCategory.toLowerCase())

      );
    }

    if (selectedFilter === "recent") {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (selectedFilter === "popular") {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    if (selectedFilter === "liked") {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  };

  const renderCategoryGrid = () => (
    <View style={styles.categoriesGrid}>
      {categories.map((item) => {
        const isSelected = item.id === selectedCategory;

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.categoryItem,
              isSelected && styles.categoryItemSelected,
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color={isSelected ? "#fff" : "#555"}
            />
            <Text
              style={[
                styles.categoryLabel,
                isSelected && { color: "#fff" },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.label}
            </Text>
            <Text
              style={[
                styles.categoryCount,
                isSelected && { color: "#fff" },
              ]}
            >
              {item.count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderArticleCard = ({ item }) => (
    <View style={styles.articleCard}>
                {item.image ? (
            <Image 
                source={{ uri: item.image }} 
                style={styles.articleImage} 
            />
            ) : (
            <View style={styles.articleImagePlaceholder} />
            )}
      <Text style={styles.articleTitle}>{item.titulo}</Text>
      <Text style={styles.articleSubtitle}>{item.subtitulo}</Text>

      <View style={styles.authorSection}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.authorName}>{item.autor}</Text>
          <Text style={styles.authorRole}>{item.profissao}</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {item.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.articleFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.footerItem}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.footerText}>{item.tempo || "6 minutos"}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.footerText}>{item.postadoTempo || "3 dias"}</Text>
          </View>
        </View>
        <View style={styles.footerRight}>
          <View style={styles.footerItem}>
            <Ionicons name="heart-outline" size={16} color="#555" />
            <Text style={styles.footerText}>{item.likes}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="eye-outline" size={16} color="#555" />
            <Text style={styles.footerText}>{item.views || 0}</Text>
          </View>
        </View>
      </View>

      <View style={styles.articleButtons}>
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonText}>Ler artigo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={28} color="#C31E65" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Artigos Favoritados</Text>
          <Text style={styles.subtitle}>Conteúdo dos especialistas</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar artigos"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterButtonsContainer}>
        {[
          { id: "recent", label: "Mais recentes" },
          { id: "popular", label: "Mais populares" },
          { id: "liked", label: "Mais curtidos" },
        ].map((btn) => {
          const selected = btn.id === selectedFilter;
          return (
            <TouchableOpacity
              key={btn.id}
              style={[
                styles.filterButton,
                selected && styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedFilter(btn.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selected && { color: "#fff" },
                ]}
              >
                {btn.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 20 }} />

      <View style={styles.dividerLine} />

      <View style={{ height: 20 }} />

<Text style={styles.categoriesTitle}>Categorias</Text>

      <View style={styles.categoriesGrid}>
        {categories.map((cat) => {
          const selected = cat.id === selectedCategory;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                selected && styles.categoryItemSelected,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <MaterialCommunityIcons
                name={cat.icon}
                size={28}
                color={selected ? "#fff" : "#555"}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  selected && { color: "#fff" },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.recommendedTitle}>Artigos recomendados</Text>
       {getFilteredArticles().map((item) => renderArticleCard({ item }))}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    paddingVertical: 2,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 6,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  filterButtonSelected: {
    backgroundColor: "#C31E65",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#C31E65",
    fontWeight: "bold",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: -16,
  },
  categoriesTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginBottom: 12,
    height: 110,
  },
  categoryItemSelected: {
    backgroundColor: "#C31E65",
    borderColor: "#C31E65",
  },
  categoryLabel: {
    marginTop: 4,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    fontSize: 8,
    lineHeight: 14,
    maxWidth: 70,
  },
  categoryCount: {
    fontWeight: "600",
    color: "#999",
    fontSize: 11,
  },
  recommendedTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  articleCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  articleImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
    articleImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  articleTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  articleSubtitle: {
    fontSize: 11,
    color: "#666",
    marginBottom: 12,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    marginRight: 8,
  },
  authorName: {
    fontWeight: "600",
    fontSize: 13,
  },
  authorRole: {
    fontSize: 11,
    color: "#999",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "bold",
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  footerLeft: {
    flexDirection: "row",
  },
  footerRight: {
    flexDirection: "row",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  footerText: {
    fontSize: 11,
    color: "#555",
    marginLeft: 4,
  },
  articleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  readButton: {
    flex: 1,
    backgroundColor: "#C31E65",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  readButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shareButton: {
    width: 40,
    backgroundColor: "#C31E65",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});