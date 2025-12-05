import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PINK = "#C31E65";

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }} 
      >

        <LinearGradient
          colors={["#C31E65", "#E64A8E"]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerLeft}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={26} color="#fff" />
              <Text style={styles.headerTitle}>Sobre Nós</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={50} color="#fff" />
          </View>

          <Text style={styles.bigText}>
            Apoiando Mães em Cada Passo da Jornada
          </Text>
          <Text style={styles.smallText}>
            Conectando conhecimento profissional com o amor materno
          </Text>
        </LinearGradient>

        <View style={[styles.card, { marginTop: 30 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications-outline" size={20} color={PINK} />
            <Text style={styles.cardTitle}>Nossa missão</Text>
          </View>

          <Text style={styles.cardText}>
            Criamos este aplicativo com um propósito claro: oferecer às mães de
            primeira viagem um espaço seguro, acolhedor e repleto de informações
            confiáveis. Sabemos que a maternidade pode ser desafiadora,
            especialmente nos primeiros meses, e queremos estar ao seu lado em
            cada momento.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Mães conectadas</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Artigos publicados</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Avaliação Média</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nossos valores</Text>

        <View style={styles.valueCard}>
          <Ionicons name="heart-outline" size={28} color={PINK} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.valueTitle}>Acolhimento</Text>
            <Text style={styles.valueDesc}>
              Criamos um ambiente seguro e acolhedor para{"\n"} 
              todas as mães
            </Text>
          </View>
        </View>

        <View style={styles.valueCard}>
          <Ionicons name="shield-checkmark-outline" size={28} color={PINK} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.valueTitle}>Confiança</Text>
            <Text style={styles.valueDesc}>
              Informações verificadas por profissionais de saúde qualificados
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerGradient: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5,
  },

  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  bigText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  smallText: {
    color: "#fff",
    opacity: 0.9,
    fontSize: 11,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  cardText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    textAlign: "justify"
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#FDE1EB",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#FFC8DD",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  statNumber: {
    color: PINK,
    fontSize: 20,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#555",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 20,
  },

  valueCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 15,
    alignItems: "center",
  },

  valueTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  valueDesc: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});

