import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BottomNav from "../components/BottomNavProfessional";
import { Ionicons } from "@expo/vector-icons";

export default function TasksProfessional({ navigation }) {
  const [selectedDay, setSelectedDay] = useState("21"); 
  const [tarefas, setTarefas] = useState([
    {
      time: "8:00 - 8:30",
      title: "Escrever artigo",
      description: "Sobre alimentação",
      done: false,
      date: "21", 
    },
    {
      time: "8:30 - 9:00",
      title: "Arrumar anotação",
      description: "Organizar todas as pastas",
      done: false,
      date: "21", 
    },
    {
      time: "9:10 - 10:00",
      title: "Ler",
      description: "Ler sobre mães de primeira viagem",
      done: false,
      date: "21", 
    },
    {
      time: "11:00 - 12:00",
      title: "Almoço",
      description: "Preparar almoço",
      done: false,
      date: "21", 
    },
    {
      time: "13:00 - 15:00",
      title: "Publicar",
      description: "Publicar artigos sobre alimentação",
      done: false,
      date: "21", 
    },
    {
      time: "16:00 - 16:30",
      title: "Banho",
      description: "Dar banho na Elena",
      done: false,
      date: "21", 
    },
  ]);

  const dias = [
    { date: "21", weekday: "Segunda" },
    { date: "22", weekday: "Terça" },
    { date: "23", weekday: "Quarta" },
    { date: "24", weekday: "Quinta" },
    { date: "25", weekday: "Sexta" },
    { date: "26", weekday: "Sábado" },
    { date: "27", weekday: "Domingo" },
  ];

  function toggleDone(index) {
    const newTarefas = [...tarefas];
    newTarefas[index].done = !newTarefas[index].done;
    setTarefas(newTarefas);
  }

  const tarefasDoDia = tarefas.filter((task) => task.date === selectedDay);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Text style={styles.headerTitleLeft}>Hoje</Text>
            <Text style={styles.headerSubtitleLeft}>{tarefasDoDia.length} tarefas</Text>
          </View>
          <View style={styles.centerHeader}>
            <Text style={styles.headerDateCenter}>
              {selectedDay === "21" && "21 de julho"}
              {selectedDay === "22" && "22 de julho"}
              {selectedDay === "23" && "23 de julho"}
              {selectedDay === "24" && "24 de julho"}
              {selectedDay === "25" && "25 de julho"}
              {selectedDay === "26" && "26 de julho"}
              {selectedDay === "27" && "27 de julho"}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Create")}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
          >
            {dias.map((dia, index) => {
              const isActive = dia.date === selectedDay;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, isActive && styles.dayButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(dia.date)} 
                >
                  <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>
                    {dia.date}
                  </Text>
                  <Text
                    style={[styles.dayWeek, isActive && styles.dayWeekActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {dia.weekday}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Minhas tarefas</Text>

          {tarefasDoDia.length === 0 ? (
            <Text style={styles.noTasksText}>Sem tarefas no momento</Text>
          ) : (
            <View style={styles.tasksContainer}>
              {tarefasDoDia.map((task, index) => {
                const isDone = task.done;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.taskCard, isDone && styles.taskCardDone]}
                    activeOpacity={0.8}
                    onPress={() => toggleDone(index)}
                  >
                    <View style={styles.taskInfo}>
                      <View style={styles.taskTimeContainer}>
                        <Text style={[styles.taskTime, isDone && styles.taskTimeDone]}>
                          {task.time.split(" - ")[0]}
                        </Text>
                        <Text
                          style={[
                            styles.taskTime,
                            isDone && styles.taskTimeDone,
                            { marginHorizontal: 5 },
                          ]}
                        >
                          -
                        </Text>
                        <Text style={[styles.taskTime, isDone && styles.taskTimeDone]}>
                          {task.time.split(" - ")[1]}
                        </Text>
                      </View>
                      <View style={styles.taskTextContainer}>
                        <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                          {task.title}
                        </Text>
                        <Text style={[styles.taskDesc, isDone && styles.taskDescDone]}>
                          {task.description}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isDone ? "checkbox" : "checkbox-outline"}
                      size={28}
                      color={isDone ? "#fff" : "#C31E65"}
                      style={styles.checkboxIcon}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="TasksProfessional" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#C31E65",
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftHeader: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 40,
    paddingLeft: 10,
  },
  centerHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 40,
    alignItems: "center",
  },
  headerDateCenter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerTitleLeft: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerSubtitleLeft: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 60,
  },
  addButtonText: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 16,
  },
  daysContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dayButton: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 75,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    shadowColor: "#C31E65",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  dayButtonActive: {
    backgroundColor: "#C31E65",
    borderColor: "#C31E65",
  },
  dayDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C31E65",
  },
  dayDateActive: {
    color: "#fff",
  },
  dayWeek: {
    fontSize: 12,
    color: "#C31E65",
    marginTop: 4,
  },
  dayWeekActive: {
    color: "#fff",
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 20,
    fontSize: 27,
    fontWeight: "normal",
    color: "#C31E65",
  },
  tasksContainer: {
    paddingHorizontal: 16,
  },
  noTasksText: {
    fontSize: 16,
    color: "#C31E65",
    textAlign: "center",
    marginTop: 20,
  },
  taskCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#aaa",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#F9C8D3",
  },
  taskCardDone: {
    backgroundColor: "#C31E65",
    borderColor: "#C31E65",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  taskTimeContainer: {
    flexDirection: "row",
    width: 110,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  taskTextContainer: {
    marginLeft: 20,
    flexShrink: 1,
  },
  taskTime: {
    color: "#C31E65",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskTimeDone: {
    color: "#fff",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C31E65",
  },
  taskTitleDone: {
    color: "#fff",
  },
  taskDesc: {
    fontSize: 13,
    color: "#C31E65",
    marginTop: 4,
  },
  taskDescDone: {
    color: "#fff",
  },
  checkboxIcon: {
    marginLeft: 10,
  },
  bodyContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 0,
    marginTop: -30,
    paddingTop: 20,
  },
});