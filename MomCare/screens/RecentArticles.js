import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNav from "../components/BottomNavProfessional"; 

const articles = [
  {
    id: 1,
    title: "Primeiros sinais de desenvolvimento motor",
    category: "Desenvolvimento",
    date: "2 dias atrás",
    views: 234,
    likes: 54,
    comments: 12,
  },
  {
    id: 2,
    title: "Como estabelecer uma rotina de sono",
    category: "Sono",
    date: "5 dias atrás",
    views: 432,
    likes: 65,
    comments: 24,
  },
  {
    id: 3,
    title: "Alimentação complementar: guia completo",
    category: "Alimentação",
    date: "1 semana atrás",
    views: 321,
    likes: 34,
    comments: 11,
  },
];

const moreArticles = [
  {
    id: 4,
    title: "Importância do estímulo sensorial",
    category: "Desenvolvimento",
    date: "3 semanas atrás",
    views: 150,
    likes: 20,
    comments: 5,
  },
  {
    id: 5,
    title: "Alimentação saudável para bebês",
    category: "Alimentação",
    date: "1 mês atrás",
    views: 290,
    likes: 40,
    comments: 8,
  },
  {
    id: 6,
    title: "Dicas para melhorar o sono infantil",
    category: "Sono",
    date: "2 meses atrás",
    views: 370,
    likes: 50,
    comments: 15,
  },
];

const ArticleItem = ({ article, showEditInline }) => {
  const categoryLower = article.category.toLowerCase();
  const words = article.title.split(" ");
  const formattedTitle = words.map((word, index) => {
    const cleanWord = word.replace(/[^a-zA-ZÀ-ú]/g, ""); 
    const isBold = cleanWord.toLowerCase() === categoryLower;
    return (
      <Text key={index} style={isBold ? { fontWeight: "bold" } : null}>
        {word + " "}
      </Text>
    );
  });

  return (
    <View style={styles.articleItem}>
      <View style={styles.articleInfo}>
        <Text style={styles.articleTitle}>{formattedTitle}</Text>

        <View style={styles.articleMeta}>
          <Text style={styles.articleBadge}>{article.category}</Text>
          <Text style={styles.articleDate}>{article.date}</Text>
        </View>

        <View
          style={[
            styles.articleStatsRow,
            showEditInline && { justifyContent: "space-between", alignItems: "center" },
          ]}
        >
          <View style={styles.articleStatsGroup}>
            <View style={styles.articleStatsItem}>
              <Ionicons name="eye-outline" size={14} color="#888" />
              <Text style={styles.articleStatsText}>{article.views}</Text>
            </View>
            <View style={styles.articleStatsItem}>
              <Ionicons name="heart-outline" size={14} color="#888" />
              <Text style={styles.articleStatsText}>{article.likes}</Text>
            </View>
            <View style={styles.articleStatsItem}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color="#888" />
              <Text style={styles.articleStatsText}>{article.comments}</Text>
            </View>
          </View>

          {showEditInline && (
            <TouchableOpacity>
              <Text style={[styles.editLink, { marginTop: 0 }]}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!showEditInline && (
        <View style={styles.articleActions}>
          <View style={styles.publishedBadge}>
            <Text style={styles.publishedText}>Publicado</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const RecentArticles = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140, marginTop: 40 }}>
        <View style={styles.recentArticlesCard}>
          <View style={styles.recentArticlesTitleContainer}>
            <Ionicons name="document-text-outline" size={22} color="#C31E65" />
            <Text style={styles.recentArticlesTitle}>Artigos recentes</Text>
          </View>
          {articles.map((article) => (
            <View key={article.id} style={{ marginBottom: 12 }}>
              <ArticleItem article={article} showEditInline={false} />
            </View>
          ))}
        </View>

        <View style={[styles.recentArticlesCard, { marginTop: 24 }]}>
          <View style={styles.recentArticlesTitleContainer}>
            <Ionicons name="albums-outline" size={22} color="#C31E65" />
            <Text style={styles.recentArticlesTitle}>Todos os artigos</Text>
          </View>
          {[...articles, ...moreArticles].map((article) => (
            <View key={article.id} style={{ marginBottom: 12 }}>
              <ArticleItem article={article} showEditInline={false} />
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="RecentArticles" />
    </View>
  );
};

export default RecentArticles;

const styles = StyleSheet.create({
  recentArticlesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#EEE",
  },
  recentArticlesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  recentArticlesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C31E65",
  },
  articleItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  articleInfo: {
    flex: 1,
    paddingRight: 8,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  articleBadge: {
    fontSize: 12,
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: "#555",
    fontWeight: "bold",
  },
  articleDate: {
    fontSize: 12,
    color: "#777",
    marginLeft: 8,
  },
  articleStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  articleStatsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  articleStatsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  articleStatsText: {
    fontSize: 12,
    color: "#888",
  },
  publishedBadge: {
    backgroundColor: "#34A853",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  publishedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  articleActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  editLink: {
    fontSize: 12,
    color: "#C31E65",
    fontWeight: "bold",
    marginTop: 16,
  },
});

