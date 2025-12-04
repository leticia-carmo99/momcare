import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useMother } from "../providers/MotherContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

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

export default function SeeAll() {
  const { motherId } = useMother();

  const today = new Date();
  const todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [entries, setEntries] = useState([]);

    useEffect(() => {
    if (!motherId) return;

    const load = async () => {
      const q = query(
        collection(db, "diario"),
        where("userId", "==", motherId),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setEntries(list);
    };

    load();
  }, [motherId]);


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

  const navigation = useNavigation(); 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Daily')} 
          >
            <Ionicons name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarWrapper}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              dayComponent={({ date, state }) => (
                <CustomDay date={date} state={state} />
              )}
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
              markingType={null} 
              style={styles.calendar}
            />
          </View>

          <View style={styles.entriesContainer}>
            <View style={styles.entriesRow}>
              {entries.map((entry, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.entryCard}
                  onPress={() => {
                    navigation.navigate("Comment"); 
                  }}
                >
                  <Text style={styles.entryText}>{entry.text}</Text>
                  <View style={styles.entryBottomRow}>
                    <View style={styles.entryMoodRow}>
                      <MoodIcon mood={entry.mood} />
                      <Text style={styles.entryMood}>{entry.mood}</Text>
                    </View>
                    <Text style={styles.entryDate}>{entry.createdAt?.toDate().toLocaleDateString("pt-BR")}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  return <Ionicons name={iconName} size={18} color={iconColor} style={{ marginRight: 6 }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    paddingBottom: 40, 
  },

  topBar: {
    backgroundColor: '#C31E65',
    paddingTop: 40, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  backButton: {
    padding: 8,
  },

  calendarContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40, 
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

  entriesContainer: {
    marginTop: 30,
    marginHorizontal: 20, 
  },

  entriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly', 
  },

  entryCard: {
    backgroundColor: "#FFD6EC",
    borderRadius: 15, 
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "48%", 
    height: 120, 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
  },

  entryText: {
    fontSize: 14,
    color: "#C31E65",
    fontWeight: "bold",
    textAlign: 'left', 
    marginBottom: 8, 
  },

  entryBottomRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: '100%',
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
    fontSize: 10, 
    color: "#C31E65",
    textAlign: 'right', 
  },
});

