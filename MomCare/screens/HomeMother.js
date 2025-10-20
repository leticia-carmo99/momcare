import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 
import BottomNav from "../components/BottomNavMother";
import babyImage from "../assets/baby.png";

// Firebase imports
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig"; // ajuste o caminho conforme sua configuração firebase

export default function HomeMother({ navigation, route }) {
  const user = route?.params?.user || null;
  const [bebes, setBebes] = useState([]);

  // Novos estados para sorrisos e tempo de sono
  const [sorrisosHoje, setSorrisosHoje] = useState(12);
  const [tempoSono, setTempoSono] = useState({ horas: 7, minutos: 30 });

  const db = getFirestore(app);

  useEffect(() => {
    if (!user?.id) return;

    // Busca os bebês da mãe (user.id), ordenando do mais velho para o mais novo
    const q = query(
      collection(db, "bebes"),
      where("userId", "==", user.id),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listaBebes = [];
      querySnapshot.forEach((doc) => {
        listaBebes.push({ id: doc.id, ...doc.data() });
      });
      setBebes(listaBebes);
    });

    return () => unsubscribe();
  }, [user]);

  // Função que calcula a idade do bebê (meses e dias)
  function calcularIdade(dataNascimento) {
    // Suporte para timestamp Firestore ou string
    const nascimento = dataNascimento.toDate ? dataNascimento.toDate() : new Date(dataNascimento);
    const agora = new Date();

    let meses = (agora.getFullYear() - nascimento.getFullYear()) * 12 + (agora.getMonth() - nascimento.getMonth());
    let dias = agora.getDate() - nascimento.getDate();

    if (dias < 0) {
      meses -= 1;
      dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate(); // dias do mês anterior
    }

    return `${meses}m ${dias}d`;
  }

  // Função para incrementar o tempo de sono em 15 minutos
  function incrementarTempoSono() {
    let { horas, minutos } = tempoSono;
    minutos += 15;
    if (minutos >= 60) {
      horas += 1;
      minutos -= 60;
    }
    setTempoSono({ horas, minutos });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        style={styles.container}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <LinearGradient
            colors={["#C6266C", "#DA5B92"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heartIconContainer}
          >
            <Ionicons name="heart-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.greeting}>
              Boa tarde{user?.name ? `, ${user.name}!` : "!"}
            </Text>
            <Text style={styles.question}>Como você está hoje?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#C31E65" />
          </TouchableOpacity>
        </View>

        {/* Cards dos bebês - Scroll horizontal para vários */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          contentContainerStyle={{ alignItems: 'center', paddingLeft: 12, paddingRight: 15,}}
          snapToInterval={345} // 320 (largura do card) + 25 (marginRight)
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {bebes.length > 0 ? (
            bebes.map((bebe, index) => {
              const primeiroNome = bebe.nome.split(" ")[0]; // pega só o primeiro nome
              return (
                <View
                  key={bebe.id}
                  style={[
                    styles.babyCard,
                    {
                      width: 320,
                      marginRight: index === bebes.length - 1 ? 0 : 20, // último card sem marginRight
                    },
                  ]}
                >
                  <Image source={babyImage} style={styles.babyImage} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.babyName}>{primeiroNome}</Text>
                      <View style={styles.ageBadge}>
                        <Text style={styles.babyAge}>{calcularIdade(bebe.dataNascimento)}</Text>
                      </View>
                    </View>
                    <Text style={styles.babyStatus}>Crescendo forte e saudável!</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ marginLeft: 20, fontSize: 14, color: "#888" }}>
              Nenhum bebê cadastrado.
            </Text>
          )}
        </ScrollView>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FontAwesome name="smile-o" size={28} color="#07A29C" />
            <Text style={styles.statLabel}>Sorrisos hoje</Text>
            <Text style={[styles.statValue, { color: "#07A29C" }]}>{sorrisosHoje}</Text>

            {/* Botão de decrementar */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#065853", left: 12, right: 'auto' }]}
              onPress={() => setSorrisosHoje(prev => (prev > 0 ? prev - 1 : 0))}
            >
              <Text style={styles.addButtonText}>-</Text>
            </TouchableOpacity>

            {/* Botão de incrementar */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#07A29C" }]}
              onPress={() => setSorrisosHoje(sorrisosHoje + 1)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="sleep" size={28} color="#00B61C" />
            <Text style={styles.statLabel}>Tempo de sono</Text>
            <Text style={[styles.statValue, { color: "#00B61C" }]}>
              {tempoSono.horas}h {tempoSono.minutos}m
            </Text>

            {/* Botão de decrementar */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#016d0a", left: 12, right: 'auto' }]}
              onPress={() => {
                let { horas, minutos } = tempoSono;
                if (horas === 0 && minutos === 0) return; // não pode decrementar abaixo de 0
                minutos -= 15;
                if (minutos < 0) {
                  horas -= 1;
                  minutos = 45;
                }
                setTempoSono({ horas, minutos });
              }}
            >
              <Text style={styles.addButtonText}>-</Text>
            </TouchableOpacity>

            {/* Botão de incrementar */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#00B61C" }]}
              onPress={incrementarTempoSono}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dica do dia */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="star-outline" size={18} color="#C31E65" />
            <Text style={styles.tipTitle}>Dica do dia</Text>
          </View>
          <Text style={styles.tipText}>
            Lembre-se de manter a rotina do bebê consistente para um desenvolvimento saudável. Nós estamos com você!
          </Text>
        </View>

        {/* Próximas atividades */}
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

      {/* Navegação inferior */}
      <BottomNav navigation={navigation} activeScreen="HomeMother" user={user} />
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
  menuButton: {
    padding: 8,
  },
  babyCard: {
    flexDirection: "row",
    backgroundColor: "#FFECF7",
    borderRadius: 14,
    padding: 20,
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
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 12,
    bottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
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
    color: "#C31E65",
    lineHeight: 20,
    textAlign: "justify",
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