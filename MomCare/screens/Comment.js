import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Comment({ navigation }) {
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="#B92572" />
          </TouchableOpacity>

          <Text style={styles.title}>
            Um dia complicado para mim{"\ne a Elena"}
          </Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              21 de julho  13:14 - 1.030 caracteres
            </Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="create-outline" size={24} color="#B92572" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trash-bin-outline" size={24} color="#B92572" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.paragraph}>
            Hoje foi um daqueles dias que parecem durar uma eternidade. Tudo começou cedo, com a Elena acordando antes do sol nascer, chorando sem parar. Achei que fosse fome, depois fralda, depois cólica... tentei de tudo, mas nada parecia acalmá-la. Ver um bebê tão inquieto e não conseguir ajudá-la da forma que eu queria me partiu o coração.
            Na hora do banho, a água ficou fria do nada. Ela chorou ainda mais e eu quase chorei junto. Me senti exausta, sozinha, sobrecarregada. Sei que ainda é muito pequeno, que tudo é novo pra eu também. Mas às vezes parece que eu não estou dando conta.
            Agora que ela finalmente dormiu, estou aqui, exausta, escrevendo enquanto olho para aquele rostinho tranquilo. E é estranho... como alguém tão pequeno pode causar tanto caos, e ainda assim encher meu coração de amor?
            Mesmo nos momentos mais difíceis, há algo nela que me faz continuar. Talvez seja o jeito como ela segura meu dedo com tanta força, ou aquele suspiro leve quando finalmente pega no sono. É nesses pequenos instantes que eu me encontro.
            Hoje foi difícil, mas também foi real. E talvez amanhã seja também. Mas tudo bem. Estamos aprendendo, eu e ela. Um passo de cada vez.
          </Text>
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
  backIcon: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B92572',
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap', // Permite que os itens se ajustem se necessário
  },
  subtitle: {
    fontSize: 13,
    color: '#B92572',
    flex: 1, // Faz o subtítulo ocupar o espaço restante
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 1, // Garante que os ícones não saiam da tela
  },
  iconButton: {
    marginLeft: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#B92572',
    textAlign: 'justify',
    lineHeight: 26,
  },
});

