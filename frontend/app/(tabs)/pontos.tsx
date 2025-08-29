import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import BackButton from '@/components/BackButton';


// Dados do usuário
const USER_DATA = {
  totalPoints: 420,
  level: 'Prata',
  nextLevel: 'Ouro',
  pointsToNextLevel: 80,
  rank: '#1.247',
  totalUsers: '15.432'
};

// Histórico de missões
const MISSION_HISTORY = [
  {
    id: '1',
    title: 'Preencha seu perfil',
    points: '+10',
    date: '15/05/2024',
    status: 'completed',
    type: 'profile'
  },
  {
    id: '2',
    title: 'Participe de um desafio',
    points: '+20',
    date: '14/05/2024',
    status: 'completed',
    type: 'challenge'
  },
  {
    id: '3',
    title: 'Compre conteúdo',
    points: '+15',
    date: '13/05/2024',
    status: 'completed',
    type: 'purchase'
  },
  {
    id: '4',
    title: 'Ganhe um super desconto',
    points: '+15',
    date: '12/05/2024',
    status: 'completed',
    type: 'discount'
  },
  {
    id: '5',
    title: 'Revise o conteúdo da semana',
    points: '+5',
    date: '11/05/2024',
    status: 'completed',
    type: 'review'
  },
  {
    id: '6',
    title: 'Convide um amigo',
    points: '+25',
    date: '10/05/2024',
    status: 'completed',
    type: 'referral'
  },
  {
    id: '7',
    title: 'Complete 3 missões',
    points: '+30',
    date: '09/05/2024',
    status: 'completed',
    type: 'achievement'
  },
  {
    id: '8',
    title: 'Faça login por 7 dias',
    points: '+50',
    date: '08/05/2024',
    status: 'completed',
    type: 'streak'
  }
];

// Estatísticas mensais
const MONTHLY_STATS = [
  { month: 'Jan', points: 180 },
  { month: 'Fev', points: 220 },
  { month: 'Mar', points: 195 },
  { month: 'Abr', points: 280 },
  { month: 'Mai', points: 420 }
];

export default function PontosScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');

  const getStatusIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      profile: '👤',
      challenge: '🏆',
      purchase: '🛒',
      discount: '🏷️',
      review: '📝',
      referral: '👥',
      achievement: '🎯',
      streak: '🔥'
    };
    return icons[type] || '✅';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? '#28a745' : '#ffc107';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Header com pontos e nível */}
        <View style={styles.headerSection}>
              <BackButton />
          <View style={styles.pointsCard}>
            <View style={styles.pointsMain}>
              <Text style={styles.pointsLabel}>Seus Pontos</Text>
              <Text style={styles.pointsValue}>{USER_DATA.totalPoints}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Nível {USER_DATA.level}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((USER_DATA.totalPoints - (USER_DATA.totalPoints - USER_DATA.pointsToNextLevel)) / USER_DATA.pointsToNextLevel) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.nextLevelText}>
                {USER_DATA.pointsToNextLevel} pts para {USER_DATA.nextLevel}
              </Text>
            </View>
          </View>

          {/* Ranking */}
          <View style={styles.rankingCard}>
            <Text style={styles.rankingLabel}>Seu Ranking</Text>
            <Text style={styles.rankingValue}>{USER_DATA.rank}</Text>
            <Text style={styles.rankingSubtext}>de {USER_DATA.totalUsers} usuários</Text>
          </View>
        </View>

        {/* Filtros de período */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Semana', 'Mês', 'Trimestre', 'Ano'].map((period) => (
              <TouchableOpacity 
                key={period}
                style={[
                  styles.filterChip, 
                  selectedPeriod === period && styles.filterChipActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedPeriod === period && styles.filterChipTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Gráfico de pontos */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Evolução dos Pontos</Text>
          <View style={styles.chart}>
            {MONTHLY_STATS.map((stat, index) => {
              const maxPoints = Math.max(...MONTHLY_STATS.map(s => s.points));
              const height = (stat.points / maxPoints) * 100;
              return (
                <View key={stat.month} style={styles.chartBar}>
                  <View style={[styles.bar, { height: `${height}%` }]} />
                  <Text style={styles.barLabel}>{stat.month}</Text>
                  <Text style={styles.barValue}>{stat.points}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Histórico de missões */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Missões</Text>
          
          {MISSION_HISTORY.map((mission) => (
            <View key={mission.id} style={styles.missionItem}>
              <View style={styles.missionIcon}>
                <Text style={styles.missionIconText}>{getStatusIcon(mission.type)}</Text>
              </View>
              
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDate}>{mission.date}</Text>
              </View>
              
              <View style={styles.missionPoints}>
                <Text style={[styles.pointsText, { color: getStatusColor(mission.status) }]}>
                  {mission.points}
                </Text>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(mission.status) }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Botão para mais detalhes */}
        <View style={styles.moreDetailsContainer}>
          <TouchableOpacity style={styles.btnMoreDetails}>
            <Text style={styles.btnMoreDetailsText}>Ver Histórico Completo</Text>
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
  },
  pointsCard: {
    backgroundColor: '#0e76e0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  pointsMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  nextLevelText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  rankingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rankingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  rankingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 4,
  },
  rankingSubtext: {
    fontSize: 12,
    color: '#999',
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
  chartContainer: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#0e76e0',
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#999',
  },
  historyContainer: {
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
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 20,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  missionIconText: {
    fontSize: 20,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#292a2b',
    marginBottom: 4,
  },
  missionDate: {
    fontSize: 12,
    color: '#999',
  },
  missionPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreDetailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnMoreDetails: {
    backgroundColor: '#0e76e0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnMoreDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 