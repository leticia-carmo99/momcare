import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ArticleScreen({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonInner}>
          <Ionicons name="arrow-back" size={22} color="#C31E65" />
        </View>
      </TouchableOpacity>

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require('../assets/fotoartigo.png')}
            style={styles.headerImage}
          />

          <View style={styles.articleContainer}>
            <Text style={styles.title}>Introdução alimentar -</Text>
            <Text style={styles.subtitle}>
              Um Marco Importante no Desenvolvimento do Seu Bebê
            </Text>
            <Text style={styles.author}>Dra. Mayara Almeida de Campos - Pediatra</Text>
            <Text style={styles.date}>01/08/2025</Text>

            <Text style={styles.paragraph}>
              A introdução alimentar é um momento muito especial — e também cheio de dúvidas para muitas famílias. Como
              pediatra, acompanho diariamente pais e mães ansiosos para saber quando e como oferecer os primeiros alimentos
              ao bebê. Por isso, neste post, quero trazer algumas orientações importantes para tornar esse processo mais leve,
              seguro e prazeroso.
            </Text>

            <Text style={styles.sectionTitle}>Quando Começar?</Text>

            <Text style={styles.paragraph}>
              A recomendação atual da Organização Mundial da Saúde (OMS) é que a introdução alimentar comece aos 6 meses de
              vida, quando o bebê já apresenta sinais de prontidão, como:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Sustentar bem o pescoço e a cabeça;</Text>
              <Text style={styles.bulletItem}>• Sentar com apoio;</Text>
              <Text style={styles.bulletItem}>• Demonstrar interesse pela comida;</Text>
              <Text style={styles.bulletItem}>
                • Perder o reflexo de extrusão (quando o bebê empurra tudo para fora da boca com a língua).
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Até os 6 meses, o leite materno (ou fórmula, quando necessário) supre todas as necessidades nutricionais do
              bebê. A introdução de outros alimentos antes desse período pode trazer mais riscos do que benefícios.
            </Text>

            <Text style={styles.sectionTitle}>Como Começar?</Text>
            <Text style={styles.paragraph}>
              O ideal é começar com frutas amassadas ou raspadas no garfo, em pequenas quantidades e com intervalos regulares,
              respeitando o apetite do bebê. É importante observar sinais de aceitação e introduzir um alimento por vez para
              identificar possíveis reações alérgicas.
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Voltar para o Fórum</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  articleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    marginTop: -40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    color: '#C31E65',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 16,
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 10,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 4,
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
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
});

