import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavMother({ navigation, activeScreen, user }) {
  return (
    <View style={styles.bottomNav}>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('MotherRoot', { user })}
      >
        <Ionicons 
          name="home-outline" 
          size={26} 
          color={activeScreen === 'HomeMother' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'HomeMother' ? '#C31E65' : '#999' }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Daily')}
      >
        <Ionicons 
          name={activeScreen === 'Daily' ? "book" : "book-outline"} 
          size={26} 
          color={activeScreen === 'Daily' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'Daily' ? '#C31E65' : '#999' }]}>
          Diário
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('TasksMother')}
      >
        <Ionicons 
          name="clipboard-outline" 
          size={26}  
          color={activeScreen === 'TasksMother' ? '#C31E65' : '#999'}
        />
        <Text style={[styles.navText, { color: activeScreen === 'TasksMother' ? '#C31E65' : '#999' }]}>
          Tarefas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('ForumMother', { user })}
      >
        <Ionicons 
          name={activeScreen === 'ForumMother' ? "chatbubbles" : "chatbubbles-outline"} 
          size={26} 
          color={activeScreen === 'ForumMother' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'ForumMother' ? '#C31E65' : '#999' }]}>
          Fórum
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('ProfileMother', { user })}
      >
        <Ionicons 
          name={activeScreen === 'ProfileMother' ? "person" : "person-outline"} 
          size={26} 
          color={activeScreen === 'ProfileMother' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'ProfileMother' ? '#C31E65' : '#999' }]}>
          Perfil
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    position: 'absolute', 
    bottom: 30,   
    left: 20,    
    right: 20,    
    backgroundColor: '#f2f2f2',
    paddingVertical: 10, 
    paddingHorizontal: 10,
    borderRadius: 40,   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: { 
    alignItems: 'center',
  },
  navText: { 
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  }
});

