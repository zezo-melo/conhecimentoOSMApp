import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Olá, Usuário BRB!</Text>
        </View>

        {/* Card de progresso */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Nível 4</Text>
          <Text style={styles.progressXP}>1395 XP</Text>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Grid de opções */}
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('descontos')}
          >
            <Ionicons name="pricetag-outline" size={40} color="#1976D2" />
            <Text style={styles.gridText}>Descontos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('cursos')}
          >
            <Ionicons name="school-outline" size={40} color="#1976D2" />
            <Text style={styles.gridText}>Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('pontos')}
          >
            <Ionicons name="gift-outline" size={40} color="#1976D2" />
            <Text style={styles.gridText}>Pontos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('emprestimos')}
          >
            <Ionicons name="card-outline" size={40} color="#1976D2" />
            <Text style={styles.gridText}>Emprestimo</Text>
          </TouchableOpacity>
        </View>

        {/* Promoção */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Promoção para você</Text>
          <View style={styles.promoCard}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>20% OFF</Text>
            </View>
            <View style={styles.promoInfo}>
              <Text style={styles.promoProduct}>Tênis Esportivo</Text>
              <Text style={styles.promoDate}>Válido até 31 de maio</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


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
  },
  header: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#292a2b',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  progressCard: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  progressXP: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#90caf9',
  },
  progressBarFill: {
    width: '60%', // progresso (exemplo)
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1976D2'
  },
  gridIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    tintColor: '#1976D2',
  },
  gridText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  promoSection: {
    marginBottom: 20,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  promoCard: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 15,
  },
  discountText: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 14,
  },
  promoInfo: {
    flex: 1,
  },
  promoProduct: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  promoDate: {
    fontSize: 12,
    color: '#e3f2fd',
  },
});
