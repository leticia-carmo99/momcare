import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function App() {
  const primaryColor = '#C31E65'; // O rosa que você mencionou

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header com hora e ícones de status */}
        <View style={styles.header}>
          <Text style={styles.time}>12:00</Text>
          <View style={styles.statusIcons}>
            {/* Ícones placeholder, você pode usar ícones reais como o 'Ionicons' do '@expo/vector-icons' */}
            <Text style={styles.icon}>📶</Text>
            <Text style={styles.icon}>🔋</Text>
          </View>
        </View>

        {/* Fundo com linhas abstratas - simulado com um View e bordas ou SVG para algo mais complexo */}
        <View style={styles.backgroundLines}>
          {/* Você pode adicionar SVGs ou outras formas aqui para as linhas */}
        </View>

        {/* Caixa de conteúdo principal rosa */}
        <View style={[styles.contentBox, { backgroundColor: primaryColor }]}>
          <Text style={styles.cadastrarText}>Cadastrar</Text>
          <Text style={styles.descriptionText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled it to make
            a type specimen book. It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing
            Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including
          </Text>
        </View>

        {/* Linhas abstratas inferiores */}
        <View style={styles.backgroundLinesBottom}>
          {/* Você pode adicionar SVGs ou outras formas aqui para as linhas */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: StatusBar.currentHeight, // Garante que o conteúdo não se sobreponha à barra de status
  },
  header: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute', // Permite que a caixa de conteúdo flutue por baixo
    top: StatusBar.currentHeight,
    zIndex: 1, // Garante que o header fique acima de outros elementos
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 16,
    marginLeft: 5,
    color: '#000',
  },
  backgroundLines: {
    position: 'absolute',
    top: 0,
    width: width * 1.2, // Maior que a largura da tela para as curvas
    height: height * 0.6, // Altura ajustada
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 300, // Curva para simular o design
    borderBottomRightRadius: 300,
    transform: [{ scaleX: 0.8 }, { rotate: '-20deg' }], // Para dar um efeito de ângulo e perspectiva
    borderColor: '#eee', // Cor das linhas
    borderWidth: 1,
    opacity: 0.7,
    left: -width * 0.2, // Posição para as linhas ficarem mais à esquerda
  },
  backgroundLinesBottom: {
    position: 'absolute',
    bottom: -height * 0.1, // Posição para as linhas inferiores
    width: width * 1.2,
    height: height * 0.3,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    transform: [{ scaleX: 0.8 }, { rotate: '20deg' }],
    borderColor: '#eee',
    borderWidth: 1,
    opacity: 0.7,
    right: -width * 0.2,
  },
  contentBox: {
    width: '90%',
    height: height * 0.75, // Altura da caixa de conteúdo
    backgroundColor: '#C31E65',
    borderRadius: 30, // Borda arredondada
    padding: 20,
    marginTop: height * 0.1, // Margem superior para posicionar abaixo do header
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: '#000', // Sombra para dar profundidade
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cadastrarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: height * 0.1, // Ajuste para descer o texto 'Cadastrar'
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
});