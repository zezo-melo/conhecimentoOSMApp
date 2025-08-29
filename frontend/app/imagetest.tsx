import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';

export default function ImageTestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>🔍 Teste de Imagens</Text>
        
        {/* Teste 1: Imagem BRB */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>1. Logo BRB (caminho correto):</Text>
          <Image
            source={require('../assets/images/brb-logo.png')}
            style={styles.testImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Teste 2: Imagem padrão do Expo */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>2. Icon padrão (deve funcionar):</Text>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.testImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Teste 3: Imagem com caminho alternativo */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>3. Logo BRB (caminho alternativo):</Text>
          <Image
            source={require('../assets/images/brb-logo.png')}
            style={styles.testImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Informações de debug */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>📋 Informações de Debug:</Text>
          <Text style={styles.debugText}>• Caminho correto: ../assets/images/</Text>
          <Text style={styles.debugText}>• Arquivo: brb-logo.png</Text>
          <Text style={styles.debugText}>• Tamanho: 16KB</Text>
          <Text style={styles.debugText}>• Formato: PNG</Text>
          <Text style={styles.debugText}>• Estrutura: components/ → assets/</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  imageContainer: {
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    fontWeight: '600',
  },
  testImage: {
    width: 120,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ff0000',
    borderRadius: 8,
  },
  debugInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 