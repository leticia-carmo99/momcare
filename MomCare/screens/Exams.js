import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#C31E65";

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={80} color={PINK} />
        <Text style={styles.title}>Em construção</Text>
        <Text style={styles.description}>
          Aguarde atualizações futuras.{"\n"}Estamos trabalhando para trazer novidades!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: PINK,
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },
});
