import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';

// Dados do ranking
const RANKING_DATA = [
  { position: 1, name: 'Maria Silva', points: 2840, level: 'Diamante' },
  { position: 2, name: 'João Santos', points: 2650, level: 'Ouro' },
  { position: 3, name: 'Ana Costa', points: 2480, level: 'Ouro' },
  { position: 4, name: 'Pedro Oliveira', points: 2320, level: 'Prata' },
  { position: 5, name: 'Carla Lima', points: 2180, level: 'Prata' },
  { position: 6, name: 'Roberto Alves', points: 2050, level: 'Prata' },
  { position: 7, name: 'Fernanda Rocha', points: 1920, level: 'Prata' },
  { position: 8, name: 'Lucas Pereira', points: 1780, level: 'Prata' },
];

export default function RankScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header do ranking */}
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>🏆 Ranking de Pontos</Text>
          <Text style={styles.subtitleText}>Veja quem está liderando o ranking</Text>
        </View>

        {/* Top 3 Pódio */}
        <View style={styles.podiumContainer}>
          {/* 2º Lugar */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumCircle, styles.secondPlace]}>
              <Text style={styles.podiumPosition}>2</Text>
            </View>
            <Text style={styles.podiumName}>Ana Costa</Text>
            <Text style={styles.podiumPoints}>2.480 pts</Text>
            <Text style={styles.podiumLevel}>Ouro</Text>
          </View>

          {/* 1º Lugar */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumCircle, styles.firstPlace]}>
              <Text style={styles.podiumPosition}>1</Text>
            </View>
            <Text style={styles.podiumName}>Maria Silva</Text>
            <Text style={styles.podiumPoints}>2.840 pts</Text>
            <Text style={styles.podiumLevel}>Diamante</Text>
          </View>

          {/* 3º Lugar */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumCircle, styles.thirdPlace]}>
              <Text style={styles.podiumPosition}>3</Text>
            </View>
            <Text style={styles.podiumName}>João Santos</Text>
            <Text style={styles.podiumPoints}>2.650 pts</Text>
            <Text style={styles.podiumLevel}>Ouro</Text>
          </View>
        </View>

        {/* Lista completa do ranking */}
        <View style={styles.rankingListContainer}>
          <Text style={styles.rankingListTitle}>Ranking Completo</Text>
          
          {RANKING_DATA.map((user, index) => (
            <View key={user.position} style={styles.rankingItem}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{user.position}</Text>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userLevel}>{user.level}</Text>
              </View>
              
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{user.points.toLocaleString()} pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botão para ver mais */}
        <View style={styles.moreButtonContainer}>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>Ver Ranking Completo</Text>
          </TouchableOpacity>
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
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 30,
    height: 200,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  podiumCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstPlace: {
    backgroundColor: '#FFD700',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  secondPlace: {
    backgroundColor: '#C0C0C0',
  },
  thirdPlace: {
    backgroundColor: '#CD7F32',
  },
  podiumPosition: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  podiumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 4,
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 14,
    color: '#0e76e0',
    fontWeight: '600',
    marginBottom: 2,
  },
  podiumLevel: {
    fontSize: 12,
    color: '#666',
  },
  rankingListContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rankingListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e76e0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#292a2b',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 12,
    color: '#666',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e76e0',
  },
  moreButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moreButton: {
    backgroundColor: '#0e76e0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});