import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { formatName } from "../../utils/formatName";

// Os dados das missões permanecem os mesmos
const MISSIONS = [
  { id: 'profile', title: 'Preencha seu perfil', points: '+10 pontos', completed: false },
  { id: '2', title: 'Participe de um desafio', points: '+20 pontos', completed: false },
  { id: '3', title: 'Compre conteúdo', points: '+15 pontos', completed: false },
  { id: '4', title: 'Ganhe um super desconto', points: '+15 pontos', completed: false },
  { id: '5', title: 'Revise o conteúdo da semana', points: '+5 pontos', completed: false },
  { id: '6', title: 'Convide um amigo', points: '+25 pontos', completed: false },
  { id: '7', title: 'Complete 3 missões', points: '+30 pontos', completed: false },
  { id: '8', title: 'Faça login por 7 dias', points: '+50 pontos', completed: false },
  { id: '9', title: 'Avalie o app', points: '+15 pontos', completed: false },
  { id: '10', title: 'Compartilhe nas redes', points: '+20 pontos', completed: false },
];

export default function HomeScreen() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // 1. FUNÇÃO SIMPLIFICADA
  const handleMissionPress = (missionId: string) => {
    setSelectedMissionId(selectedMissionId === missionId ? null : missionId);
  };

  // 2. FUNÇÃO SIMPLIFICADA: APENAS NAVEGA PARA EDIÇÃO
  const handleFirstMissionAction = () => {
    // A lógica de ganho de pontos é 100% no backend.
    router.push('/editProfile');
  };

  const handleSecondMissionAction = () => {
    router.push('/quiz' as any);
  };

  // 3. FUNÇÃO QUE CHECA O STATUS NO CONTEXTO (QUE VEM DO BACKEND)
  const isMissionCompleted = (missionId: string) => {
    if (missionId === 'profile') {
      return user?.missionsCompleted?.includes('profile') === true || user?.profileMissionCompleted === true;
    }
    if (missionId === '2') {
      return user?.missionsCompleted?.includes('quiz2') === true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingSectionMentorh}>
          <Text style={styles.greetingTextMentorh}>Seu MentoRH de conhecimentos</Text>
        </View>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Olá! {formatName(user?.name)} 👋</Text>
          <Text style={styles.subtitleText}>Pronto para mais uma missão?</Text>
        </View>

        {/* Container das missões */}
        <View style={styles.missionsContainer}>
          {/* Linha central */}
          <View style={styles.centralLine} />

          {/* Missões */}
          {MISSIONS.map((mission, index) => {
            const isCompleted = isMissionCompleted(mission.id);
            return (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.missionNode,
                  { top: 60 + (index * 220) },
                  isCompleted && styles.missionNodeCompleted
                ]}
                // Se a missão 1 estiver completa, o clique não expande mais o balão
                onPress={() => !isCompleted && handleMissionPress(mission.id)}
                disabled={isCompleted} // Desabilita o node se estiver completa
              >
                {/* Círculo da missão */}
                <View style={[styles.missionCircle, isCompleted && styles.completedCircle]}>
                  <Text style={styles.missionNumber}>{isCompleted ? '✓' : index + 1}</Text>
                </View>

                {/* Balão de informações da missão */}
                {selectedMissionId === mission.id && (
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    {mission.id === 'profile' ? (
                      <TouchableOpacity 
                        disabled={isCompleted} 
                        // Chama a ação simplificada (navegar)
                        onPress={handleFirstMissionAction} 
                      >
                        <Text style={[styles.btnMission, isCompleted && styles.btnMissionCompleted]}>
                          {isCompleted ? 'Concluída' : 'Começar +10 pontos'}
                        </Text>
                      </TouchableOpacity>
                    ) : mission.id === '2' ? (
                      <TouchableOpacity 
                        disabled={isCompleted}
                        onPress={handleSecondMissionAction}
                      >
                        <Text style={[styles.btnMission, isCompleted && styles.btnMissionCompleted]}>
                          {isCompleted ? 'Concluída' : 'Começar +20 pontos'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      // Outras missões
                      <TouchableOpacity disabled={isCompleted}>
                        <Text style={[styles.btnMission, isCompleted && styles.btnMissionCompleted]}>
                          {isCompleted ? 'Concluída' : `Começar ${mission.points}`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          
          {/* Espaço extra no final para rolagem */}
          <View style={styles.bottomSpacer} />
        </View>
            
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... Seus estilos permanecem inalterados
  missionNodeCompleted: {
    opacity: 1,
  },
  btnMissionCompleted: {
    backgroundColor: '#aaa',
    color: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ececec',
    paddingTop: 20,
    paddingBottom: 200,
  },
  completedCircle: {
        backgroundColor: '#4a7f37',
    },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 15, // Reduzido de 20 para 15
    paddingBottom: 25, // Reduzido de 30 para 25
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 8,
    textAlign: 'center',
  },
    greetingTextMentorh: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    marginTop: -10,
  },
  greetingSectionMentorh:{
    marginTop: -20,
    paddingTop: 20,
    backgroundColor: '#1a5d2b',
  },
  subtitleText: {
    fontSize: 18,
    color: '#292a2b',
    textAlign: 'center',

  },
  missionsContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 1400, // Altura mínima para acomodar todas as missões
  },
  centralLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#4a7f37',
    borderRadius: 2,
  },
  missionNode: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
  },
  missionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a7f37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  missionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  missionInfo: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  missionPoints: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
  btnMission: {
    backgroundColor: '#4a7f37',
    padding: 10,
    color: '#fff',
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  // Estilos da seção de promoção
  promotionSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  promotionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 16,
  },
  promotionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promotionImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#0e76e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promotionImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  promotionInfo: {
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#0e76e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promotionProductTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 4,
  },
  promotionValidUntil: {
    fontSize: 14,
    color: '#666',
  },
  promotionArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 24,
    color: '#0e76e0',
    fontWeight: 'bold',
  },
});