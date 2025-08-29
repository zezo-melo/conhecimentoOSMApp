import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import BackButton from '@/components/BackButton';


// Dados das promoções
const PROMOCOES = [
  {
    id: '1',
    title: 'Tênis Esportivo',
    discount: '20% OFF',
    validUntil: '31 de maio',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=TN',
    category: 'Calçados'
  },
  {
    id: '2',
    title: 'Curso de Investimentos',
    discount: '30% OFF',
    validUntil: '15 de junho',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=IN',
    category: 'Educação'
  },
  {
    id: '3',
    title: 'Restaurante Premium',
    discount: '25% OFF',
    validUntil: '20 de junho',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=RT',
    category: 'Alimentação'
  },
  {
    id: '4',
    title: 'Cinema',
    discount: '2x1',
    validUntil: '30 de junho',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=CN',
    category: 'Entretenimento'
  },
  {
    id: '5',
    title: 'Academia',
    discount: '50% OFF',
    validUntil: '10 de julho',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=AC',
    category: 'Saúde'
  },
  {
    id: '6',
    title: 'Livraria Online',
    discount: '15% OFF',
    validUntil: '25 de julho',
    image: 'https://via.placeholder.com/80x80/0e76e0/ffffff?text=LV',
    category: 'Educação'
  }
];

export default function DescontosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >


        {/* Área de saudação */}
        <View style={styles.greetingSection}>
        <BackButton />
          <Text style={styles.greetingText}>Descontos Exclusivos</Text>
          <Text style={styles.subtitleText}>Aproveite as melhores ofertas para clientes do banco</Text>
        </View>

        {/* Filtros de categoria */}
        <View style={styles.filtersContainer}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={styles.filterChipTextActive}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Calçados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Educação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Alimentação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Entretenimento</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Lista de promoções */}
        <View style={styles.promocoesContainer}>
          {PROMOCOES.map((promocao) => (
            <TouchableOpacity key={promocao.id} style={styles.promocaoCard}>
              {/* Imagem da promoção */}
              <View style={styles.promocaoImageContainer}>
                <View style={styles.promocaoImage}>
                  <Text style={styles.promocaoImageText}>{promocao.title.charAt(0)}</Text>
                </View>
              </View>
              
              {/* Informações da promoção */}
              <View style={styles.promocaoInfo}>
                <View style={styles.promocaoHeader}>
                  <Text style={styles.promocaoCategory}>{promocao.category}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{promocao.discount}</Text>
                  </View>
                </View>
                
                <Text style={styles.promocaoTitle}>{promocao.title}</Text>
                <Text style={styles.promocaoValidUntil}>Válido até {promocao.validUntil}</Text>
                
                <TouchableOpacity style={styles.btnVerDetalhes}>
                  <Text style={styles.btnVerDetalhesText}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
              
              {/* Seta indicativa */}
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#0e76e0',
    borderColor: '#0e76e0',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  promocoesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  promocaoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promocaoImageContainer: {
    marginRight: 16,
  },
  promocaoImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#0e76e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promocaoImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  promocaoInfo: {
    flex: 1,
  },
  promocaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promocaoCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  discountBadge: {
    backgroundColor: '#0e76e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promocaoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 4,
  },
  promocaoValidUntil: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  btnVerDetalhes: {
    backgroundColor: '#0e76e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  btnVerDetalhesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 24,
    color: '#0e76e0',
    fontWeight: 'bold',
  },
}); 