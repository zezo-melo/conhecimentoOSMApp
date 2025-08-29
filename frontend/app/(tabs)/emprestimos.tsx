import React from 'react';
import Header from '@/components/Header';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Linking } from 'react-native';
import BackButton from '@/components/BackButton';

const LOAN_OPTIONS = [
  {
    title: 'Crédito Pessoal',
    description: 'Crédito simples, rápido e sem burocracia...',
    image: require('../../assets/images/credito-pessoal.png'),
    buttonText: 'Saiba Mais',
    action: 'personal_loan',
    url: 'https://novo.brb.com.br/para-voce/emprestimos-e-financiamentos/',
  },
  {
    title: 'Crédito Consignado',
    description: 'Com o BRB você tem as condições certas...',
    image: require('../../assets/images/credito-consignado.png'),
    buttonText: 'Saiba Mais',
    action: 'payroll_loan',
    url: 'https://novo.brb.com.br/para-voce/emprestimos-e-financiamentos/',
  },
];


// O componente principal da tela de Empréstimos.
export default function LoansScreen() {
  const handlePress = (loanType: string) => {
    const url = 'https://novo.brb.com.br/para-voce/emprestimos-e-financiamentos/';
    Linking.openURL(url).catch(err => console.error("Erro ao abrir link: ", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <View style={styles.cardGrid}>
          {LOAN_OPTIONS.map((loan, index) => (
            <View key={index} style={styles.card}>
              
              {/* Agora renderizando a imagem específica */}
              <Image
                source={loan.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{loan.title}</Text>
                <Text style={styles.cardText}>{loan.description}</Text>
                
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => Linking.openURL(loan.url)}
                >
                  <Text style={styles.buttonText}>{loan.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  cardGrid: {
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200, // ajusta conforme quiser
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  cardButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
