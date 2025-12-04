import React, { useState, useEffect } from "react"; 
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNav from "../components/BottomNavProfessional"; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebaseConfig";

import { useProfessional } from "../providers/ProfessionalContext";

 const ArticleItem = ({ article, showEditInline }) => {
    const categoryLower = article.category.toLowerCase();
    const words = String(article.title || "").split(" ");
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
                <Text style={styles.articleTitle}>
                    <Text>{formattedTitle}</Text>
                </Text>

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
    const { professionalData } = useProfessional();
    const professionalId = professionalData?.id; 
    
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);

    const fetchProfessionalArticles = async () => {
        if (!professionalId) {
            setLoading(false);
            if (professionalData === null || professionalData === undefined) {
                 setError("Carregando dados do profissional...");
            } else {
                 setError("ID do profissional não encontrado para busca.");
            }
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const q = query(
                collection(db, "artigos"),
                where("id_autor", "==", professionalId)
            );

            const querySnapshot = await getDocs(q);
const fetchedArticles = querySnapshot.docs.map(doc => {
    const data = doc.data();

    const createdAt = data.data_criacao?.toDate?.()
        ? data.data_criacao.toDate()
        : new Date();

            return {
                id: doc.id,
                title: data.titulo || "Título não informado",
                category: data.tags && data.tags.length > 0 ? data.tags[0] : "Geral",
                createdAt, 
                date: createdAt.toLocaleDateString("pt-BR"),
                views: data.views ? parseInt(data.views, 10) : 0,
                likes: Array.isArray(data.curtidas) ? data.curtidas.length : 0,
                comments: 0,
            };
        });
            fetchedArticles.sort((a, b) => b.createdAt - a.createdAt);

            setArticles(fetchedArticles);

        } catch (err) {
            console.error("Erro ao buscar artigos:", err);
            setError("Não foi possível carregar seus artigos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessionalArticles();
    }, [professionalId]); 
    
    const recentArticles = articles.slice(0, 3);
    const allArticles = articles;

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerMessage}>
                    <ActivityIndicator size="large" color="#C31E65" />
                    <Text style={{ marginTop: 10, color: '#555' }}>Carregando artigos...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerMessage}>
                    <Ionicons name="alert-circle-outline" size={30} color="#C31E65" />
                    <Text style={{ marginTop: 10, color: '#C31E65', textAlign: 'center' }}>{error}</Text>
                    <TouchableOpacity onPress={fetchProfessionalArticles} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (articles.length === 0) {
            return (
                <View style={styles.centerMessage}>
                    <Ionicons name="document-outline" size={30} color="#C31E65" />
                    <Text style={{ marginTop: 10, color: '#555' }}>Você ainda não publicou nenhum artigo.</Text>
                </View>
            );
        }

        return (
            <>
                <View style={styles.recentArticlesCard}>
                    <View style={styles.recentArticlesTitleContainer}>
                        <Ionicons name="document-text-outline" size={22} color="#C31E65" />
                        <Text style={styles.recentArticlesTitle}>Artigos recentes</Text>
                    </View>
                    {recentArticles.map((article) => (
                        <View key={article.id} style={{ marginBottom: 12 }}>
                            <ArticleItem article={article} showEditInline={false} /> 
                        </View>
                    ))}
                </View>

                <View style={[styles.recentArticlesCard, { marginTop: 24 }]}>
                    <View style={styles.recentArticlesTitleContainer}>
                        <Ionicons name="albums-outline" size={22} color="#C31E65" />
                        <Text style={styles.recentArticlesTitle}>Todos os artigos ({allArticles.length})</Text>
                    </View>
                    {allArticles.map((article) => (
                        <View key={article.id} style={{ marginBottom: 12 }}>
                            
                            <ArticleItem article={article} showEditInline={true} /> 
                        </View>
                    ))}
                </View>
            </>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140, marginTop: 40 }}>
                {renderContent()}
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
    marginTop: 50,
  },
});

