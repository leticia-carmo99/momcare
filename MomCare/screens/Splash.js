import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('User'); 
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoname.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#C31E65" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  spinner: {
    marginTop: 10,
  },
});
