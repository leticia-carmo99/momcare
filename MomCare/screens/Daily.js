import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNavMother";
import campoDeFlores from "../assets/campodeflores.png";
import coracao from "../assets/coracao.png";
import { useMother } from "../providers/MotherContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Daily({ navigation }) {
 const { motherData, motherId } = useMother();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!motherData) return;

    const fetchEntries = async () => {
      const q = query(
        collection(db, "diario"),
        where("userId", "==", motherId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEntries(list);
    };

    fetchEntries();
  }, [motherData]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Image source={coracao} style={styles.coracaoImage} />
        <Image source={campoDeFlores} style={styles.headerImage} />

        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.verTodosButton}
              onPress={() => navigation.navigate("SeeAll")} 
            >
              <Text style={styles.verTodosText}>Ver todos</Text>
            </TouchableOpacity>

            <View style={styles.rightSide}>
              <View style={styles.titlesContainer}>
                <Text style={styles.title}>Seu diário</Text>
                <Text style={styles.subtitle}>Conte sobre seu dia</Text>
              </View>
              <TouchableOpacity
                style={styles.buttonAdd}
                onPress={() => navigation.navigate('NewComment')}
              >
                <Ionicons name="add" size={24} color="#C31E65" />
              </TouchableOpacity>

            </View>
          </View>

          <View style={styles.entriesContainer}>
            {entries.map((entry, index) => (
              <TouchableOpacity
                key={index}
                style={styles.entryCard}
                onPress={() => {
                  if (entry.text === "Um dia complicado para mim e a Elena") {
                    navigation.navigate("Comment");
                  }
                }}
              >
                <Text style={styles.entryText}>{entry.text}</Text>
                <View style={styles.entryBottomRow}>
                  <View style={styles.entryMoodRow}>
                    <MoodIcon mood={entry.mood} />
                    <Text style={styles.entryMood}>{entry.mood}</Text>
                  </View>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="Daily" />
    </View>
  );
}

function MoodIcon({ mood }) {
  let iconName;
  let iconColor = "#C31E65";

  switch (mood.toLowerCase()) {
    case "triste":
      iconName = "sad-outline";
      break;
    case "feliz":
      iconName = "happy-outline";
      break;
    case "doente":
      iconName = "thermometer-outline";
      break;
    case "com raiva":
      iconName = "warning-outline";
      break;
    default:
      iconName = "help-outline";
  }

  return (
    <Ionicons
      name={iconName}
      size={18}
      color={iconColor}
      style={{ marginRight: 6 }}
    />
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },

  headerImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },

  coracaoImage: {
    position: "absolute",
    top: 150,
    left: -10,
    width: 150,
    height: 150,
    resizeMode: "contain",
    zIndex: 3,
  },

  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 25,
  },

  verTodosButton: {
    backgroundColor: "#C31E65",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 15,
  },

  verTodosText: {
    color: "#fff",
    fontWeight: "bold",
  },

  rightSide: {
    alignItems: "flex-end",
    flexShrink: 1,
    width: 180,
  },

  titlesContainer: {
    marginBottom: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#C31E65",
    textAlign: "right",
  },

  subtitle: {
    fontSize: 15,
    color: "#C31E65",
    marginTop: 5,
    textAlign: "right",
  },

  buttonAdd: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#C31E65",
    justifyContent: "center",
    alignItems: "center",
  },

  entryCard: {
    backgroundColor: "#FFD6EC",
    borderRadius: 15,
    paddingVertical: 26,
    paddingHorizontal: 15,
    marginBottom: 12,
  },

  entryText: {
    fontSize: 14,
    color: "#C31E65",
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: "70%",
  },

  entryBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  entryMoodRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  entryMood: {
    fontSize: 12,
    color: "#C31E65",
    fontWeight: "600",
  },

  entryDate: {
    fontSize: 14,
    color: "#C31E65",
  },
});

