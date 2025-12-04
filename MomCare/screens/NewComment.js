import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, TouchableOpacity, TextInput, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMother } from "../providers/MotherContext";
import { db } from "../firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function NewComment({ navigation }) {
  const { motherData, motherId } = useMother();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const saveEntry = async () => {
await addDoc(collection(db, "diario"), {
  userId: motherId,
  title,
  text: content,
  mood: "feliz", 
  date: new Date().toLocaleDateString("pt-BR"),
  createdAt: Timestamp.now()
});


  navigation.goBack();
};

  const characterCount = content.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require('../assets/flor.png')}
            style={styles.flowerImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.whiteBox}>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Daily')}>
              <Ionicons name="arrow-back" size={24} color="#B92572" />
            </TouchableOpacity>

            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="arrow-undo-outline" size={22} color="#B92572" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="arrow-redo-outline" size={22} color="#B92572" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveEntry}>
                <Ionicons name="checkmark" size={28} color="#B92572" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Título"
            placeholderTextColor="#B92572"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("pt-BR")}  • {characterCount} caracteres
          </Text>

          <TextInput
            style={styles.contentInput}
            placeholder="Conte seu dia"
            placeholderTextColor="#B92572"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#C31E65',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerImage: {
    width: 120,
    height: 120,
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 25,
    marginTop: -30,
    zIndex: 2,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 6,
  },
  confirmButton: {
    padding: 6, 
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B92572',
    marginBottom: 6,
    paddingHorizontal: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#B92572',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 0,
  },
  contentInput: {
    fontSize: 16,
    color: '#B92572',
    lineHeight: 24,
    minHeight: 200,
    paddingHorizontal: 0,
  },
});
