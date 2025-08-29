import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import BackButton from '@/components/BackButton';


// Dados dos cursos
const CURSOS = [
  {
    id: '1',
    title: 'Curso de Investimentos para Iniciantes',
    instructor: 'Prof. Carlos Silva',
    duration: '8 semanas',
    level: 'Iniciante',
    pointsRequired: 150,
    originalPrice: 'R$ 297,00',
    discountedPrice: 'R$ 197,00',
    discount: '34% OFF',
    image: 'https://via.placeholder.com/100x100/0e76e0/ffffff?text=IN',
    category: 'Finanças',
    available: true
  },
  {
    id: '2',
    title: 'Marketing Digital Avançado',
    instructor: 'Dra. Ana Costa',
    duration: '12 semanas',
    level: 'Avançado',
    pointsRequired: 250,
    originalPrice: 'R$ 497,00',
    discountedPrice: 'R$ 347,00',
    discount: '30% OFF',
    image: 'https://via.placeholder.com/100x100/0e76e0/ffffff?text=MD',
    category: 'Marketing',
    available: true
  },
  {
    id: '3',
    title: 'Programação Web Full Stack',
    instructor: 'Eng. Pedro Santos',
    duration: '16 semanas',
    level: 'Intermediário',
    pointsRequired: 300,
    originalPrice: 'R$ 797,00',
    discountedPrice: 'R$ 597,00',
    discount: '25% OFF',
    image: 'https://via.placeholder.com/100x100/0e76e0/ffffff?text=FS',
    category: 'Tecnologia',
    available: true
  },
  {
    id: '4',
    title: 'Gestão de Projetos',
    instructor: 'Prof. Maria Oliveira',
    duration: '10 semanas',
    level: 'Intermediário',
    pointsRequired: 200,
    originalPrice: 'R$ 397,00',
    discountedPrice: 'R$ 297,00',
    discount: '25% OFF',
    image: 'https://via.placeholder.com/100x100/0e76e0/ffffff?text=GP',
    category: 'Gestão',
    available: false
  },
  {
    id: '5',
    title: 'Inglês para Negócios',
    instructor: 'Prof. John Smith',
    duration: '14 semanas',
    level: 'Intermediário',
    pointsRequired: 180,
    originalPrice: 'R$ 447,00',
    discountedPrice: 'R$ 347,00',
    discount: '22% OFF',
    image: 'https://via.placeholder.com/100x100/0e76e0/ffffff?text=EN',
    category: 'Idiomas',
    available: true
  }
];

export default function CursosScreen() {
  const [userPoints] = useState(420); // Pontos do usuário
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Finanças', 'Marketing', 'Tecnologia', 'Gestão', 'Idiomas'];

  const handleEnrollCourse = (curso: any) => {
    if (userPoints >= curso.pointsRequired) {
      Alert.alert(
        'Confirmar Inscrição',
        `Deseja usar ${curso.pointsRequired} pontos para se inscrever no curso "${curso.title}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => Alert.alert('Sucesso!', 'Inscrição realizada com sucesso!') }
        ]
      );
    } else {
      Alert.alert('Pontos Insuficientes', 'Você não possui pontos suficientes para este curso.');
    }
  };

  const filteredCursos = selectedCategory === 'Todos' 
    ? CURSOS 
    : CURSOS.filter(curso => curso.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Área de saudação e pontos */}
        <View style={styles.greetingSection}>
          <BackButton />
          <Text style={styles.greetingText}>Cursos Exclusivos</Text>
          <Text style={styles.subtitleText}>Use seus pontos para acessar cursos com desconto</Text>
          
          {/* Card de pontos do usuário */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Seus Pontos</Text>
              <Text style={styles.pointsValue}>{userPoints}</Text>
            </View>
            <View style={styles.pointsIcon}>
              <Text style={styles.pointsIconText}>🎯</Text>
            </View>
          </View>
        </View>

        {/* Filtros de categoria */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.filterChip, 
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de cursos */}
        <View style={styles.cursosContainer}>
          {filteredCursos.map((curso) => (
            <View key={curso.id} style={styles.cursoCard}>
              {/* Imagem e informações básicas */}
              <View style={styles.cursoHeader}>
                <View style={styles.cursoImage}>
                  <Text style={styles.cursoImageText}>{curso.title.charAt(0)}</Text>
                </View>
                
                <View style={styles.cursoBasicInfo}>
                  <Text style={styles.cursoTitle}>{curso.title}</Text>
                  <Text style={styles.cursoInstructor}>por {curso.instructor}</Text>
                  
                  <View style={styles.cursoMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Duração:</Text>
                      <Text style={styles.metaValue}>{curso.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Nível:</Text>
                      <Text style={styles.metaValue}>{curso.level}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Preços e desconto */}
              <View style={styles.cursoPricing}>
                <View style={styles.priceInfo}>
                  <Text style={styles.originalPrice}>{curso.originalPrice}</Text>
                  <Text style={styles.discountedPrice}>{curso.discountedPrice}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{curso.discount}</Text>
                  </View>
                </View>
              </View>

              {/* Pontos necessários e botão */}
              <View style={styles.cursoActions}>
                <View style={styles.pointsRequired}>
                  <Text style={styles.pointsRequiredLabel}>Pontos necessários:</Text>
                  <Text style={styles.pointsRequiredValue}>{curso.pointsRequired}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.btnInscrever,
                    !curso.available && styles.btnInscreverDisabled
                  ]}
                  onPress={() => curso.available && handleEnrollCourse(curso)}
                  disabled={!curso.available}
                >
                  <Text style={styles.btnInscreverText}>
                    {curso.available ? 'Inscrever-se' : 'Indisponível'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 20,
  },
  pointsCard: {
    backgroundColor: '#0e76e0',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  pointsIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsIconText: {
    fontSize: 30,
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
  cursosContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cursoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cursoHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cursoImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#0e76e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cursoImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cursoBasicInfo: {
    flex: 1,
  },
  cursoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 4,
  },
  cursoInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cursoMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cursoPricing: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginBottom: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#292a2b',
  },
  discountBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cursoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  pointsRequired: {
    alignItems: 'flex-start',
  },
  pointsRequiredLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  pointsRequiredValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e76e0',
  },
  btnInscrever: {
    backgroundColor: '#0e76e0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnInscreverDisabled: {
    backgroundColor: '#ccc',
  },
  btnInscreverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 