import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useMother } from "../providers/MotherContext";


LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CreateMother() {
  const navigation = useNavigation();
  const { motherId } = useMother();


  const today = new Date();
  const todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('13:00');
  const [endTime, setEndTime] = useState('13:30');

  const CustomDay = ({ date, state }) => {
    const isToday = date.dateString === todayStr;
    const isSelected = date.dateString === selectedDate;

    const containerStyle = [
      styles.dayContainer,
      isSelected && styles.selectedDayContainer,
      isToday && styles.todayContainer,
    ];

    const textStyle = [
      styles.dayText,
      state === 'disabled' && styles.disabledDayText,
      isSelected && styles.selectedDayText,
      isToday && styles.todayDayText,
    ];

    return (
      <TouchableOpacity style={containerStyle} onPress={() => setSelectedDate(date.dateString)}>
        {isToday && <Text style={styles.todayLabel}>Hoje</Text>}
        <Text style={textStyle}>{date.day}</Text>
      </TouchableOpacity>
    );
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCreateTask = async () => {
  if (!title.trim()) {
    console.log("Título obrigatório");
    return;
  }

  if (!motherId) {
    console.log("motherId não encontrado!");
    return;
  }

  try {
    const day = selectedDate.split("-")[2];

    await addDoc(collection(db, "tarefas"), {
      userId: motherId,
      title,
      description,
      date: new Date().toISOString().split("T")[0],
      time: `${startTime} - ${endTime}`,
      done: false,
      createdAt: Timestamp.now(),
    });

    navigation.goBack();

  } catch (error) {
    console.log("Erro ao criar tarefa:", error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={32} color="#C31E65" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrapper}>
            <Text style={styles.header}>Criar tarefa</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <View style={styles.calendarWrapper}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              dayComponent={({ date, state }) => (
                <CustomDay date={date} state={state} />
              )}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                },
              }}
              theme={{
                backgroundColor: '#C31E65',
                calendarBackground: '#C31E65',
                monthTextColor: '#fff',
                textSectionTitleColor: '#fff',
                dayTextColor: '#fff',
                arrowColor: '#fff',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
              }}
              markingType={'custom'}
              style={styles.calendar}
            />
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Adicione um título"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#C31E65"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva a tarefa"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#C31E65"
          />

          <Text style={styles.label}>Horário</Text>

          <View style={styles.timeContainer}>
            <Text style={styles.inlineLabel}>Início</Text>
            <TextInput
              style={styles.timeInput}
              value={startTime}
              onChangeText={setStartTime}
              placeholderTextColor="#C31E65"
            />

            <Text style={styles.inlineLabel}>Término</Text>
            <TextInput
              style={styles.timeInput}
              value={endTime}
              onChangeText={setEndTime}
              placeholderTextColor="#C31E65"
            />
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText} onPress={handleCreateTask}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    paddingBottom: 120,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 10,
    justifyContent: 'space-between',
  },

  backButton: {
    padding: 8,
  },

  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#C31E65',
  },

  calendarWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },

  calendarContainer: {
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
  },

  calendar: {
    paddingBottom: 10,
  },

  dayContainer: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },

  selectedDayContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#C31E65',
    borderRadius: 16,
  },

  todayContainer: {
    backgroundColor: '#f48fb1',
    borderWidth: 1,
    borderColor: '#f48fb1',
    borderRadius: 4,
    width: 38,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayText: {
    fontSize: 14,
    color: '#fff',
  },

  selectedDayText: {
    color: '#C31E65',
    fontWeight: 'bold',
  },

  todayDayText: {
    color: '#fff',
    fontWeight: 'normal',
  },

  disabledDayText: {
    color: '#fce4ec33',
  },

  todayLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },

  form: {
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#C31E65',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
    color: '#C31E65',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#C31E65',
    marginBottom: 8,
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },

  inlineLabel: {
    color: '#C31E65',
    marginRight: 4,
    fontSize: 14,
    fontWeight: 'normal',
  },

  timeInput: {
    borderWidth: 1,
    borderColor: '#C31E65',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#C31E65',
    textAlign: 'center',
    width: 80,
    marginRight: 12,
  },

  addButton: {
    backgroundColor: '#C31E65',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
  },

  addButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
