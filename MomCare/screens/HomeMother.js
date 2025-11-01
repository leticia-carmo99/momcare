import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNavMother";
import babyImage from "../assets/baby.png";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function HomeMother({ navigation, route }) {
  const user = route?.params?.user || null;
  const [bebes, setBebes] = useState([]);
  const [sorrisosHoje, setSorrisosHoje] = useState(0);
  const [tempoSono, setTempoSono] = useState({ horas: 0, minutos: 0 });

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoModal, setTipoModal] = useState(null); // 'sorrisos' ou 'sono'
  const [inputHoras, setInputHoras] = useState("");
  const [inputMinutos, setInputMinutos] = useState("");
  const [inputModal, setInputModal] = useState("");
  const [bebeAtivo, setBebeAtivo] = useState(0); // novo estado para o índice do bebê visível

  const db = getFirestore(app);

  useEffect(() => {
    if (!user?.id) return;
    const usuarioDoc = doc(db, "maes", user.id);
    getDoc(usuarioDoc).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const ultimaAtualizacao = data.ultimaAtualizacao?.toDate
          ? data.ultimaAtualizacao.toDate()
          : data.ultimaAtualizacao;
        const hoje = new Date();
        if (
          ultimaAtualizacao &&
          ultimaAtualizacao.getDate() === hoje.getDate() &&
          ultimaAtualizacao.getMonth() === hoje.getMonth() &&
          ultimaAtualizacao.getFullYear() === hoje.getFullYear()
        ) {
          setSorrisosHoje(data.sorrisosHoje || 0);
          setTempoSono({
            horas: data.tempoSonoHoras || 0,
            minutos: data.tempoSonoMinutos || 0,
          });
        } else {
          setSorrisosHoje(0);
          setTempoSono({ horas: 0, minutos: 0 });
          setDoc(
            usuarioDoc,
            {
              sorrisosHoje: 0,
              tempoSonoHoras: 0,
              tempoSonoMinutos: 0,
              ultimaAtualizacao: hoje,
            },
            { merge: true }
          );
        }
      } else {
        const hoje = new Date();
        setDoc(usuarioDoc, {
          sorrisosHoje: 0,
          tempoSonoHoras: 0,
          tempoSonoMinutos: 0,
          ultimaAtualizacao: hoje,
        });
      }
    });
  }, [user]);

  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
      now;

    const resetTimer = setTimeout(() => {
      if (user?.id) {
        const usuarioDoc = doc(db, "maes", user.id);
        const hoje = new Date();
        setSorrisosHoje(0);
        setTempoSono({ horas: 0, minutos: 0 });
        setDoc(
          usuarioDoc,
          {
            sorrisosHoje: 0,
            tempoSonoHoras: 0,
            tempoSonoMinutos: 0,
            ultimaAtualizacao: hoje,
          },
          { merge: true }
        );
      }
    }, millisTillMidnight);

    return () => clearTimeout(resetTimer);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const q = query(collection(db, "bebes"), where("userId", "==", user.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listaBebes = [];
      querySnapshot.forEach((doc) => {
        listaBebes.push({ id: doc.id, ...doc.data() });
      });
      setBebes(listaBebes);
    });

    return () => unsubscribe();
  }, [user]);

  function calcularIdade(dataNascimento) {
    const nascimento = dataNascimento.toDate
      ? dataNascimento.toDate()
      : new Date(dataNascimento);
    const agora = new Date();

    let meses =
      (agora.getFullYear() - nascimento.getFullYear()) * 12 +
      (agora.getMonth() - nascimento.getMonth());
    let dias = agora.getDate() - nascimento.getDate();

    if (dias < 0) {
      meses -= 1;
      dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    }

    return `${meses}m ${dias}d`;
  }

  function incrementarTempoSono() {
    let { horas, minutos } = tempoSono;
    minutos += 15;
    if (minutos >= 60) {
      horas += 1;
      minutos -= 60;
    }
    const usuarioDoc = user?.id ? doc(db, "maes", user.id) : null;
    setTempoSono({ horas, minutos });
    if (usuarioDoc) {
      setDoc(
        usuarioDoc,
        {
          tempoSonoHoras: horas,
          tempoSonoMinutos: minutos,
          ultimaAtualizacao: new Date(),
        },
        { merge: true }
      );
    }
  }

  function abrirModal(tipo) {
    setTipoModal(tipo);
    if (tipo === "sorrisos") {
      setInputModal(sorrisosHoje.toString());
    } else if (tipo === "sono") {
      setInputHoras(tempoSono.horas.toString());
      setInputMinutos(tempoSono.minutos.toString());
    }
    setModalVisible(true);
  }

  function confirmarModal() {
    if (tipoModal === "sorrisos") {
      const valor = parseInt(inputModal);
      if (!isNaN(valor) && valor >= 0) {
        setSorrisosHoje(valor);
        if (user?.id) {
          const usuarioDoc = doc(db, "maes", user.id);
          setDoc(
            usuarioDoc,
            {
              sorrisosHoje: valor,
              ultimaAtualizacao: new Date(),
            },
            { merge: true }
          );
        }
      }
    } else if (tipoModal === "sono") {
      const horas = parseInt(inputHoras);
      const minutos = parseInt(inputMinutos);
      if (
        !isNaN(horas) &&
        horas >= 0 &&
        !isNaN(minutos) &&
        minutos >= 0 &&
        minutos < 60
      ) {
        setTempoSono({ horas, minutos });
        if (user?.id) {
          const usuarioDoc = doc(db, "maes", user.id);
          setDoc(
            usuarioDoc,
            {
              tempoSonoHoras: horas,
              tempoSonoMinutos: minutos,
              ultimaAtualizacao: new Date(),
            },
            { merge: true }
          );
        }
      }
    }
    setModalVisible(false);
  }

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
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.greeting}>
              Boa tarde{user?.name ? `, ${user.name}!` : "!"}
            </Text>
            <Text style={styles.question}>Como você está hoje?</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.openDrawer?.()}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color="#C31E65" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 10 }}
          contentContainerStyle={{
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 15,
          }}
          snapToInterval={345}
          decelerationRate="fast"
          snapToAlignment="start"
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const index = Math.round(x / 340);
            setBebeAtivo(index);
          }}
          scrollEventThrottle={16}
        >
          {bebes.length > 0 ? (
            bebes.map((bebe, index) => {
              const primeiroNome = bebe.nome.split(" ")[0];
              return (
                <View
                  key={bebe.id}
                  style={[
                    styles.babyCard,
                    {
                      width: 320,
                      marginRight: index === bebes.length - 1 ? 0 : 20,
                    },
                  ]}
                >
                  <Image source={babyImage} style={styles.babyImage} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.babyName}>{primeiroNome}</Text>
                      <View style={styles.ageBadge}>
                        <Text style={styles.babyAge}>
                          {calcularIdade(bebe.dataNascimento)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.babyStatus}>
                      Crescendo forte e saudável!
                    </Text>
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

        {/* Bolinhas de navegação (apenas se houver mais de um bebê) */}
        {bebes.length > 1 && (
          <View style={styles.dotsContainer}>
            {bebes.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  bebeAtivo === i && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}

        {/* resto do código permanece idêntico */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FontAwesome name="smile-o" size={28} color="#07A29C" />
            <Text style={styles.statLabel}>Sorrisos hoje</Text>

            <TouchableOpacity onPress={() => abrirModal("sorrisos")}>
              <Text style={[styles.statValue, { color: "#07A29C" }]}>
                {sorrisosHoje}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: "#07A29C", left: 12, right: "auto" },
              ]}
              onPress={() => {
                const novo = sorrisosHoje > 0 ? sorrisosHoje - 1 : 0;
                setSorrisosHoje(novo);
                if (user?.id) {
                  const usuarioDoc = doc(db, "usuarios", user.id);
                  setDoc(
                    usuarioDoc,
                    {
                      sorrisosHoje: novo,
                      ultimaAtualizacao: new Date(),
                    },
                    { merge: true }
                  );
                }
              }}
            >
              <Text style={styles.addButtonText}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#07A29C" }]}
              onPress={() => {
                const novo = sorrisosHoje + 1;
                setSorrisosHoje(novo);
                if (user?.id) {
                  const usuarioDoc = doc(db, "usuarios", user.id);
                  setDoc(
                    usuarioDoc,
                    {
                      sorrisosHoje: novo,
                      ultimaAtualizacao: new Date(),
                    },
                    { merge: true }
                  );
                }
              }}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="sleep" size={28} color="#00B61C" />
            <Text style={styles.statLabel}>Tempo de sono</Text>

            <TouchableOpacity onPress={() => abrirModal("sono")}>
              <Text style={[styles.statValue, { color: "#00B61C" }]}>
                {tempoSono.horas}h {tempoSono.minutos}m
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: "#00B61C", left: 12, right: "auto" },
              ]}
              onPress={() => {
                let { horas, minutos } = tempoSono;
                if (horas === 0 && minutos === 0) return;
                minutos -= 15;
                if (minutos < 0) {
                  horas -= 1;
                  minutos = 45;
                }
                setTempoSono({ horas, minutos });
                if (user?.id) {
                  const usuarioDoc = doc(db, "usuarios", user.id);
                  setDoc(
                    usuarioDoc,
                    {
                      tempoSonoHoras: horas,
                      tempoSonoMinutos: minutos,
                      ultimaAtualizacao: new Date(),
                    },
                    { merge: true }
                  );
                }
              }}
            >
              <Text style={styles.addButtonText}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#00B61C" }]}
              onPress={incrementarTempoSono}
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
            Lembre-se de manter a rotina do bebê consistente para um
            desenvolvimento saudável. Nós estamos com você!
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

      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {tipoModal === "sorrisos"
                ? "Digite os sorrisos de hoje"
                : "Digite o tempo de sono"}
            </Text>
            {tipoModal === "sorrisos" ? (
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={inputModal}
                onChangeText={setInputModal}
                placeholder="Número de sorrisos"
                placeholderTextColor="#aaa"
              />
            ) : (
              <View>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={inputHoras}
                  onChangeText={setInputHoras}
                  placeholder="Horas"
                  placeholderTextColor="#aaa"
                />
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={inputMinutos}
                  onChangeText={setInputMinutos}
                  placeholder="Minutos"
                  placeholderTextColor="#aaa"
                />
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmarModal}
                style={[styles.modalButton, { backgroundColor: "#C31E65" }]}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD6E7",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#C31E65",
    width: 10,
    height: 10,
  },
  /* resto do CSS inalterado */
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C31E65",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#C31E65",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
