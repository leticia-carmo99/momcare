import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VisibleProfile({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ff" />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <View style={styles.backButtonInner}>
          <Ionicons name="arrow-back" size={22} color="#C31E65" />
        </View>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={require("../assets/fotoperfil.png")}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Natália dos Santos</Text>
              <Text style={styles.subInfo}>Pediatra - CRM 12345-SP</Text>
              <View style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>Neonatologia</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons
                name="mail-outline"
                size={16}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.contactText}>dranat.santos@gmail.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons
                name="call-outline"
                size={16}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.contactText}>(11) 96276-7256</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.contactText}>São Paulo, SP</Text>
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

        <View style={styles.recentArticlesCard}>
          <View style={styles.recentArticlesTitleContainer}>
            <Ionicons name="document-text-outline" size={24} color="#C31E65" />
            <Text style={styles.recentArticlesTitle}>Artigos publicados</Text>
          </View>

          <View style={styles.articleItem}>
            <View style={styles.articleInfo}>
              <Text style={styles.articleTitle}>
                Primeiros sinais de {"\n"}
                desenvolvimento motor
              </Text>

              <View style={styles.articleMeta}>
                <Text style={styles.articleBadge}>Desenvolvimento</Text>
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
                    <Ionicons name="chatbubble-outline" size={14} color="#888" />
                    <Text style={styles.articleStatsText}>12</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>Precisando de ajuda?</Text>
          <Text style={styles.supportDescription}>
            Nossa equipe está aqui para apoiar você nesta jornada especial da maternidade.
          </Text>
          <TouchableOpacity style={styles.supportButton} onPress={() => {}}>
            <Text style={styles.supportButtonText}>Falar com suporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50, 
    left: 20,
    zIndex: 1000,
  },
  backButtonInner: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  scrollContent: {
    paddingTop: 100, 
    paddingBottom: 90,
  },
  spacer: {
    height: 0, 
  },
  profileCard: {
    backgroundColor: "#FFECF7",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F7E2EB",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  subInfo: {
    fontSize: 13,
    color: "#555",
  },
  specialtyBadge: {
    backgroundColor: "#C31E65",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  specialtyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  contactInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#FAD0E5",
    paddingTop: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 12,
    color: "#666",
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

  recentArticlesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#EEE",
    marginHorizontal: 20,
    marginBottom: 25,
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
    marginLeft: 8,
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
    marginRight: 10,
  },
  articleStatsText: {
    fontSize: 12,
    color: "#888",
  },
  viewAllButton: {
    backgroundColor: "#C31E65",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 14,
  },
  viewAllButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  supportBox: {
    backgroundColor: "#E6F2FF",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#A9D5FF",
  },
  supportTitle: {
    color: "#007ACC",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  supportDescription: {
    color: "#007ACC",
    fontSize: 13,
    marginBottom: 10,
  },
  supportButton: {
    borderWidth: 1,
    borderColor: "#007ACC",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 60,
    alignSelf: "center",
  },
  supportButtonText: {
    color: "#007ACC",
    fontWeight: "bold",
    fontSize: 14,
  },
});