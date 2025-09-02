import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNavProfessional";
import doctorImage from "../assets/baby.png"; 

export default function HomeProfessionalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={["#C6266C", "#DA5B92"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heartIconContainer}
          >
            <Ionicons name="heart-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>Boa tarde, Dra. Natália!</Text>
            <Text style={styles.subTitle}>Área do profissional</Text>
          </View>
        </View>

        <View style={styles.doctorCardPlain}>
          <Image source={doctorImage} style={styles.doctorImage} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.doctorName}>Dra. Natália dos Santos</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>Pediatra</Text>
              </View>
            </View>
            <Text style={styles.doctorSubtitle}>
              CRM 12345-SP • Especialista em Neonatologia
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <LinearGradient
          colors={["#B31552", "#F59BC9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.newArticleButton}
        >
          <TouchableOpacity>
            <Text style={styles.newArticleText}>+ Novo artigo</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsContainer}>
          {renderStat(
            "Artigos publicados",
            "24",
            "+3 este mês",
            ["#F59BC9", "#80003E"],
            "document-text-outline"
          )}
          {renderStat(
            "Visualizações",
            "12.4k",
            "+18% este mês",
            ["#80B3FF", "#004BA8"],
            "eye-outline"
          )}
          {renderStat(
            "Curtidas",
            "3.2k",
            "+24% este mês",
            ["#FF5C7C", "#990032"],
            "heart-outline"
          )}
          {renderStat(
            "Comentários",
            "265",
            "+12% este mês",
            ["#89D486", "#22863A"],
            "chatbubble-ellipses-outline"
          )}
        </View>

        <View style={styles.recentArticlesCard}>
          <View style={styles.recentArticlesTitleContainer}>
            <Ionicons name="document-text-outline" size={28} color="#C31E65" />
            <Text style={styles.recentArticlesTitle}>Artigos recentes</Text>
          </View>

          <View style={styles.articleItem}>
            <View style={styles.articleInfo}>
              <Text style={styles.articleTitle}>
                Primeiros sinais de{" "}
                <Text style={{ fontWeight: "bold" }}>desenvolvimento</Text> motor
              </Text>
              <View style={styles.articleMeta}>
                <Text style={[styles.articleBadge, { fontWeight: "bold" }]}>
                  Desenvolvimento
                </Text>
                <Text style={styles.articleDate}>2 dias atrás</Text>
              </View>
              <View style={styles.articleStatsRow}>
                <View style={styles.articleStatsGroup}>
                  <View style={styles.articleStatsItem}>
                    <Ionicons name="eye-outline" size={14} color="#888" />
                    <Text style={styles.articleStatsText}>234</Text>
                  </View>
                  <View style={styles.articleStatsItem}>
                    <Ionicons name="heart-outline" size={14} color="#888" />
                    <Text style={styles.articleStatsText}>54</Text>
                  </View>
                  <View style={styles.articleStatsItem}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={14}
                      color="#888"
                    />
                    <Text style={styles.articleStatsText}>12</Text>
                  </View>
                </View>

                <TouchableOpacity>
                  <Text style={styles.editLink}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.articleActions}>
              <TouchableOpacity style={styles.publishedBadge}>
                <Text style={styles.publishedText}>Publicado</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ height: 60, backgroundColor: "#fff" }} />

      <BottomNav navigation={navigation} activeScreen="HomeProfessional" />
    </View>
  );
}

function renderStat(label, value, change, colors, iconName) {
  return (
    <View style={styles.statBox} key={label}>
      <LinearGradient colors={colors} style={styles.statIconCircle}>
        <Ionicons name={iconName} size={26} color="#fff" />
      </LinearGradient>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statChange}>{change}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heartIconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  doctorCardPlain: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#FFECF7",
    borderColor: "#F7E2EB",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 20, 
    marginHorizontal: -20,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  doctorName: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
    color: "#000",
  },
  specialtyBadge: {
    backgroundColor: "#C31E65",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  specialtyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  doctorSubtitle: {
    fontSize: 11,
    color: "#4A4A4A",
    marginTop: 4,
  },
  newArticleButton: {
    borderRadius: 12,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 24,
  },
  newArticleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "normal",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#EEE",
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: "#444",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 4,
  },
  statChange: {
    fontSize: 13,
    color: "#1A8917",
    fontWeight: "600",
  },
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
    fontSize: 16,
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
  },
  articleDate: {
    fontSize: 12,
    color: "#777",
    marginLeft: 8,
  },
  articleStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
});
