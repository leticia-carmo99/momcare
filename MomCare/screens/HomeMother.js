import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 
import BottomNav from "../components/BottomNavMother";
import babyImage from "../assets/baby.png";

export default function HomeMotherScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
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
            <Text style={styles.greeting}>Boa tarde, Verônica!</Text>
            <Text style={styles.question}>Como você está hoje?</Text>
          </View>
        </View>

        <View style={styles.babyCard}>
          <Image source={babyImage} style={styles.babyImage} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.babyName}>Sofia</Text>
              <View style={styles.ageBadge}>
                <Text style={styles.babyAge}>3m 12d</Text>
              </View>
            </View>
            <Text style={styles.babyStatus}>Crescendo forte e saudável!</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FontAwesome name="smile-o" size={28} color="#07A29C" />
            <Text style={styles.statLabel}>Sorrisos hoje</Text>
            <Text style={[styles.statValue, { color: "#07A29C" }]}>12</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#07A29C" }]}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="sleep" size={28} color="#00B61C" />
            <Text style={styles.statLabel}>Tempo de sono</Text>
            <Text style={[styles.statValue, { color: "#00B61C" }]}>7h 30m</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#00B61C" }]}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="star-outline" size={18} color="#C31E65" />
            <Text style={styles.tipTitle}>Dica do dia</Text>
          </View>
          <Text style={styles.tipText}>
            blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </Text>
        </View>

        <View style={styles.activitiesCard}>
          <View style={styles.activitiesHeader}>
            <Ionicons name="calendar-outline" size={18} color="#C31E65" />
            <Text style={styles.activitiesTitle}>Próximas atividades</Text>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="walk-outline" size={22} color="#C31E65" />
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityText}>Passeio</Text>
              <Text style={styles.activitySubText}>Hoje das 13h às 15h</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <MaterialCommunityIcons
              name="bathtub-outline"
              size={22}
              color="#C31E65"
            />
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityText}>Banho</Text>
              <Text style={styles.activitySubText}>Hoje às 16h</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="HomeMother" />
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
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  babyCard: {
    flexDirection: "row",
    backgroundColor: "#FFECF7",
    borderRadius: 14,
    padding: 20,
    marginBottom: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F7E2EB",  
  },
  babyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  babyName: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },
  ageBadge: {
    backgroundColor: "#C31E65",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  babyAge: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  babyStatus: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginHorizontal: 5,
    backgroundColor: "#E7F5F6",
    borderWidth: 2,
    borderColor: "#C3E1E1",
    height: 170,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  statLabel: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 12,
    bottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 30,
  },
  tipCard: {
    backgroundColor: "#FFECF7",
    borderRadius: 14,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#F7E2EB",  
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#C31E65",
    marginLeft: 8, 
  },
  tipText: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
  activitiesCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "#DDDDDD",
    shadowColor: "#000",  
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,  
  },
  activitiesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activitiesTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
    marginLeft: 8, 
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  activityTextContainer: {
    marginLeft: 14,
  },
  activityText: {
    fontSize: 14,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  activitySubText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});

