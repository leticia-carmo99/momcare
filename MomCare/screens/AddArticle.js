import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useProfessional } from "../providers/ProfessionalContext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AddArticleScreen() {
  const navigation = useNavigation();

  const { professionalData } = useProfessional();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const [articleHtml, setArticleHtml] = useState('');
  const richText = useRef();

  useEffect(() => {
  const today = new Date();
  const formatted =
    today.getDate().toString().padStart(2, '0') + '/' +
    (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
    today.getFullYear();

  setCurrentDate(formatted);
}, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

const onSave = async () => {
  try {
    const html = await richText.current?.getContentHtml();

    if (!professionalData?.id) {
      alert("Erro: ID do profissional não encontrado.");
      return;
    }

    await addDoc(collection(db, "artigos"), {
      titulo: title,
      subtitulo: subtitle,
      conteudo: html,
      image: image || null,
      id_autor: professionalData.id,
      autor: professionalData.nome || "Profissional",
      profissao: professionalData.profissao || "",
      data_criacao: Timestamp.now(),
      views: "0",
      curtidas: [],
      tags: [],
      postadoTempo: "0 dias",
      tempo: "0 minutos",
    });

    navigation.navigate("HomeProfessional");
  } catch (error) {
    console.error("Erro ao salvar artigo:", error);
    alert("Não foi possível salvar o artigo.");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonInner}>
          <Ionicons name="arrow-back" size={22} color="#C31E65" />
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="camera-outline" size={100} color="#bfbfbf" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TextInput
            placeholder="Título"
            placeholderTextColor="#000"
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Sub-título"
            placeholderTextColor="#333"
            style={styles.subtitleInput}
            value={subtitle}
            onChangeText={setSubtitle}
          />

          <Text style={styles.doctor}>
            {professionalData.name} - {professionalData.profissao || 'Profissional'}
          </Text>

          <Text style={styles.date}>{currentDate}</Text>

          <RichEditor
            ref={richText}
            placeholder="Digite seu artigo"
            style={styles.richEditor}
            initialContentHTML={articleHtml}
            editorStyle={{
              backgroundColor: '#fff',
              color: '#333',
              placeholderColor: '#9e9e9e',
              contentCSSText: 'font-size: 15px; min-height: 120px;',
            }}
            onChange={setArticleHtml}
          />

          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.foreColor,
              actions.setStrikethrough,
              actions.undo,
              actions.redo,
            ]}
            iconTint="#C31E65"
            selectedIconTint="#C31E65"
            style={styles.richToolbar}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 50,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  header: {
    height: 240,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    paddingHorizontal: 25,
    paddingBottom: 25,
    paddingTop: 25,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    paddingLeft: 0,
    marginBottom: 0,
    color: '#000',
  },
  subtitleInput: {
    fontSize: 14,
    color: '#333',
    marginTop: -15,
    marginBottom: 18,
    paddingLeft: 0,
  },
  doctor: {
    color: '#C31E65',
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 0,
    marginBottom: 4,
  },
  date: {
    color: '#333',
    fontSize: 12,
    marginTop: 0,
    marginBottom: 20,
    paddingLeft: 0,
  },
  richEditor: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 120,
  },
  richToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    borderRadius: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#C31E65',
    width: 140,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});