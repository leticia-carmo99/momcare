import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNavProfessional({ navigation, activeScreen }) {
  return (
    <View style={styles.bottomNav}>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('HomeProfessional')}
      >
        <Ionicons 
          name="home-outline" 
          size={26} 
          color={activeScreen === 'HomeProfessional' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'HomeProfessional' ? '#C31E65' : '#999' }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('RecentArticles')}
      >
        <Ionicons 
          name={activeScreen === 'RecentArticles' ? "book" : "book-outline"} 
          size={26} 
          color={activeScreen === 'RecentArticles' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'RecentArticles' ? '#C31E65' : '#999' }]}>
          Artigos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('TasksProfessional')}
      >
        <Ionicons 
          name="clipboard-outline" 
          size={26}  
          color={activeScreen === 'TasksProfessional' ? '#C31E65' : '#999'}
        />
        <Text style={[styles.navText, { color: activeScreen === 'TasksProfessional' ? '#C31E65' : '#999' }]}>
          Tarefas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('ForumProfessional')} 
      >
        <Ionicons 
          name={activeScreen === 'ForumProfessional' ? "chatbubbles" : "chatbubbles-outline"} 
          size={26} 
          color={activeScreen === 'ForumProfessional' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'ForumProfessional' ? '#C31E65' : '#999' }]}>
          Fórum
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('ProfileProfessional')}
      >
        <Ionicons 
          name={activeScreen === 'ProfileProfessional' ? "person" : "person-outline"} 
          size={26} 
          color={activeScreen === 'ProfileProfessional' ? '#C31E65' : '#999'} 
        />
        <Text style={[styles.navText, { color: activeScreen === 'ProfileProfessional' ? '#C31E65' : '#999' }]}>
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
    color: '#000',  
  }
});
