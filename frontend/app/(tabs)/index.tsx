import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import BonusChest from '../../components/BonusChest';
import { useAuth } from '../../contexts/AuthContext';
import { formatName } from "../../utils/formatName";

// Definição dos tipos para maior clareza (mantida)
type Mission = {
  id: string;
  title: string;
  points: string;
  // screen agora aceita 'cacaPalavras'
  screen?: 'editProfile' | 'quiz' | 'quiz3' | 'quiz4' | 'cacaPalavras' | string;
};

type Item = Mission | { id: string; type: 'chest'; points: number; opened: boolean };

// Missões originais (atualizada com a nova missão)
const ORIGINAL_MISSIONS: Mission[] = [
  { id: 'profile', title: 'Preencha seu perfil', points: '+10 pontos', screen: 'editProfile' },
  { id: '2', title: 'Participe de um desafio', points: '+20 pontos', screen: 'quiz' },
  { id: '3', title: 'Desafio com Vídeo 1', points: '+15 pontos', screen: 'quiz3' },
  { id: '4', title: 'Desafio com Vídeo 2', points: '+15 pontos', screen: 'quiz4' },
  { id: '13', title: 'Caça Palavras da Empresa', points: '+15 pontos', screen: 'cacaPalavras' }, // << NOVA MISSÃO
  { id: '5', title: 'Compre conteúdo', points: '+15 pontos' },
  { id: '6', title: 'Ganhe um super desconto', points: '+15 pontos' },
  { id: '7', title: 'Revise o conteúdo da semana', points: '+5 pontos' },
  { id: '8', title: 'Convide um amigo', points: '+25 pontos' },
  { id: '9', title: 'Complete 3 missões', points: '+30 pontos' },
  { id: '10', title: 'Faça login por 7 dias', points: '+50 pontos' },
  { id: '11', title: 'Avalie o app', points: '+15 pontos' },
  { id: '12', title: 'Compartilhe nas redes', points: '+20 pontos' },
];

// **********************************************
// 1. LISTA DE IMAGENS DO MASCOTE
// **********************************************
const MASCOTE_IMAGES = [
    require('../../assets/images/mascote_pose1.png'), // Mantenha o path correto
    require('../../assets/images/mascote_pose2.png'),
    require('../../assets/images/mascote_pose3.png'),
    require('../../assets/images/mascote_pose4.png'),
    // Adicione mais se necessário
];


// --- COMPONENTES VISUAIS AUXILIARES ---

// 1. Mascote da OSM (Mascote do topo - mantido)
const MascoteOSM = () => (
  <View style={styles.mascoteContainer}>
    <Ionicons name="sparkles-sharp" size={30} color="#FFD700" />
    <Text style={styles.mascoteText}>Seu MentoRH</Text>
  </View>
);

// **********************************************
// 2. Componente da Ilustração do Mascote (Atualizado com imagem dinâmica)
// **********************************************
const MascoteIllustration = ({ position, imageSource }: { position: 'left' | 'right', imageSource: any }) => (
  <View style={[
    styles.illustrationContainer, 
    position === 'left' ? styles.illustrationLeft : styles.illustrationRight
  ]}>
      <Image 
          source={imageSource} 
          style={styles.illustrationImage} 
      />
  </View>
);

// Componente BonusChestItem removido - agora usando o componente BonusChest


// --- TELA PRINCIPAL E LÓGICA ---

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  const isMissionCompleted = (missionId: string) => {
    // Lógica de simulação mantida
    if (missionId === 'profile') {
      return user?.missionsCompleted?.includes('profile') === true || user?.profileMissionCompleted === true;
    }
    if (missionId === '2') {
      return user?.missionsCompleted?.includes('quiz2') === true;
    }
    if (missionId === '3') {
      return user?.missionsCompleted?.includes('quiz3') === true;
    }
    if (missionId === '4') {
      return user?.missionsCompleted?.includes('quiz4') === true;
    }
    if (missionId === '13') {
        // A missão 13 (Caça Palavras) usa o ID '13' no backend.
        return user?.missionsCompleted?.includes('13') === true;
    }
    return false;
  };

  const handleMissionPress = (missionId: string) => {
    setSelectedMissionId(selectedMissionId === missionId ? null : missionId);
  };

  // **********************************************
  // 5. FUNÇÃO DE AÇÃO (handleAction) - Adicionando a nova missão
  // **********************************************
  const handleAction = (mission: Mission) => {
    if (isMissionCompleted(mission.id)) return;

    if (mission.screen === 'editProfile') {
      router.push('/editProfile');
    } else if (mission.screen === 'quiz') {
      router.push('/quiz' as any); 
    } else if (mission.screen === 'quiz3') {
      router.push('/quiz3' as any);
    } else if (mission.screen === 'quiz4') {
      router.push('/quiz4' as any);
    } else if (mission.screen === 'cacaPalavras') { // << ROTA DO CAÇA PALAVRAS
      router.push('/cacaPalavras' as any);
    } else {
      alert(`Iniciando missão: ${mission.title}`);
    }
    setSelectedMissionId(null);
  };

  const renderItems = () => {
    const items: Item[] = [];
    
    ORIGINAL_MISSIONS.forEach((mission, index) => {
        items.push(mission);
        
        if (index === 1) { // Primeiro baú após missão 2
            items.push({ id: 'chest_1', type: 'chest', points: 10, opened: false });
        }
        if (index === 4) { // Segundo baú após missão 4 (nova posição devido à nova missão)
             items.push({ id: 'chest_2', type: 'chest', points: 15, opened: false });
        }
    });
    return items;
  };
  
  // **********************************************
  // 3. LÓGICA DE ALTERNÂNCIA (Função Principal)
  // **********************************************
  const getMascoteDetails = (missionIndex: number) => {
    
    // Calcula o índice de exibição do Mascote (a cada 2 missões)
    // O Mascote 1 aparece na Missão 2 (index 1)
    // O Mascote 2 aparece na Missão 4 (index 3)
    // O Mascote 3 aparece na Missão 6 (index 5)
    
    // Usamos um valor de '2' para controlar o espaçamento e a frequência (a cada 2 missões)
    // Usamos missionIndex + 1 para ter o número real da missão (1, 2, 3...)
    
    // A cada 2 missões (ou seja, quando o índice + 1 é par), mas não na missão 0 (1ª)
    if (missionIndex >= 1 && (missionIndex + 1) % 2 === 0) {
        
        // Define a POSIÇÃO: Alterna left/right com base no número da missão / 2
        // Ex: Missão 2 -> (2/2) = 1 (ímpar) -> left.
        // Ex: Missão 4 -> (4/2) = 2 (par) -> right.
        const position: 'left' | 'right' = Math.ceil((missionIndex + 1) / 2) % 2 !== 0 
            ? 'left' 
            : 'right';
            
        // Define a IMAGEM: Alterna as imagens disponíveis
        // Usa missionIndex / 2 para que a mesma imagem seja repetida a cada ciclo
        const imageIndex = Math.floor(missionIndex / 2) % MASCOTE_IMAGES.length;
        
        return {
            position,
            imageSource: MASCOTE_IMAGES[imageIndex],
        };
    }
    
    return null; // Não exibe o mascote
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
          <Text style={styles.greetingTextMentorh}>Sua Jornada</Text>
          <Text style={styles.greetingTextMentorh}>de Conhecimento</Text>
        </View>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Olá, {formatName(user?.name)}! 👋</Text>
          <Text style={styles.subtitleText}>Pronto para mais uma missão?</Text>
          <View style={styles.mascoteWrapper}>
              <MascoteOSM />
          </View>
        </View>

        {/* Container das missões (Trilha) */}
        <View style={styles.missionsContainer}>
          <View style={styles.centralLine} />

          {renderItems().map((item, index) => {
            if (item.type === 'chest') {
              // Item especial: Baú de Bônus
              let requiredMissions = ['profile', 'quiz2'];
              if (item.id === 'chest_2') {
                // Aumentando o número de missões requeridas para o segundo baú
                requiredMissions = ['profile', 'quiz2', 'quiz3', 'quiz4',];
              } 
              if (item.id === 'chest_3') {
                // Aumentando o número de missões requeridas para o segundo baú
                requiredMissions = ['profile', 'quiz2', 'quiz3', 'quiz4', 'mission5'];
              }
              
              return (
                <BonusChest 
                    key={item.id} 
                    chestId={item.id}
                    points={item.points}
                    requiredMissions={requiredMissions}
                />
              );
            }
            
            // Item de Missão: 
            const mission = item as Mission;
            const isCompleted = isMissionCompleted(mission.id);
            const isSelected = selectedMissionId === mission.id;
            
            const missionIndex = ORIGINAL_MISSIONS.findIndex(m => m.id === mission.id);
            const displayMissionNumber = missionIndex + 1;
            
            // Lógica de Desbloqueio (Atualizada para incluir novos baús)
            let isPreviousCompleted = true; // A primeira missão está sempre desbloqueada
            if (missionIndex > 0) {
              // Checa se a missão anterior no array ORIGINAL_MISSIONS foi completada.
              // Para as missões após um baú, a lógica é mais complexa e depende do baú.
              
              // Missão 3 (índice 2) depende do chest_1
              if (missionIndex === 2) { 
                isPreviousCompleted = user?.chestsOpened?.includes('chest_1') || false;
              } 
              // Missão 6 (índice 5) depende do chest_2
              else if (missionIndex === 5) { 
                isPreviousCompleted = user?.chestsOpened?.includes('chest_2') || false;
              }
              // Para todas as outras missões (que vêm diretamente da anterior)
              else {
                const prevMissionId = ORIGINAL_MISSIONS[missionIndex - 1]?.id;
                isPreviousCompleted = isMissionCompleted(prevMissionId);
              }
            }
            const isLocked = !isCompleted && !isPreviousCompleted;


            // **********************************************
            // 4. CHAMADA DA LÓGICA DO MASCOTE
            // **********************************************
            const mascoteDetails = getMascoteDetails(missionIndex);
            
            return (
              <View
                key={mission.id}
                style={[styles.missionNodeWrapper, { marginBottom: 150 }]} // Ajustei o marginBottom para 150
              >
                {/* Renderiza o mascote se houver detalhes */}
                {mascoteDetails && (
                    <MascoteIllustration 
                        position={mascoteDetails.position} 
                        imageSource={mascoteDetails.imageSource} 
                    />
                )}

                <TouchableOpacity
                  style={[
                    styles.missionCircle,
                    isCompleted && styles.completedCircle,
                    isLocked && styles.lockedCircle,
                  ]}
                  onPress={() => !isLocked && handleMissionPress(mission.id)}
                  disabled={isLocked || isCompleted}
                >
                  {isCompleted ? (
                      <Ionicons name="checkmark" size={40} color="#fff" />
                  ) : (
                      <Text style={styles.missionNumber}>
                          {displayMissionNumber}
                      </Text>
                  )}
                </TouchableOpacity>

                {isSelected && (
                  <View style={[
                      styles.missionInfo,
                      { marginLeft: 70 } 
                  ]}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <TouchableOpacity 
                      disabled={isCompleted} 
                      onPress={() => handleAction(mission)} 
                    >
                      <Text style={[styles.btnMission, isCompleted && styles.btnMissionCompleted]}>
                        {isCompleted ? 'Concluída' : `Começar ${mission.points}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
          
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- GERAL / SCROLL ---
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff', 
    paddingBottom: 250, 
  },
  // --- HEADER / GREETING ---
  greetingSectionMentorh: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#379a4a', 
  },
  greetingTextMentorh: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
    marginTop: -10,
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Mascote (Centralizado acima da trilha)
  mascoteWrapper: {
      marginTop: 20,
      marginBottom: -10,
      width: '100%',
      alignItems: 'center',
  },
  mascoteContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#e0f7fa',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00bcd4',
  },
  mascoteText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#00bcd4',
  },
  // --- TRILHA DE MISSÕES ---
  missionsContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70, 
    minHeight: 2000, 
  },
  centralLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8, 
    backgroundColor: '#4a7f3730', 
    borderRadius: 4,
  },
  // O missionNodeWrapper é o pai do círculo e da ilustração
  missionNodeWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 170, // Este valor deve ser ajustado para acomodar o Mascote na lateral
    position: 'relative', 
    minHeight: 65, 
  },
  // Círculo Principal (Bolinha)
  missionCircle: {
    width: 65, 
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#7acb85', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff', 
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  completedCircle: {
    backgroundColor: '#4a7f37', 
    opacity: 1,
  },
  lockedCircle: {
    backgroundColor: '#ccc', 
    opacity: 0.7,
  },
  missionNumber: {
    fontSize: 28, 
    fontWeight: '900',
    color: '#fff',
  },
  // Balão de informações (expansível)
  missionInfo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 10,
    marginLeft: 70, 
    marginTop: 70,
    marginRight: 60,
    zIndex: 15,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#292a2b',
    marginBottom: 8,
    textAlign: 'center',
  },
  btnMission: {
    backgroundColor: '#379a4a', 
    padding: 12,
    color: '#fff',
    borderRadius: 12,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  btnMissionCompleted: {
    backgroundColor: '#aaa',
    color: '#fff',
  },
  // Estilos do baú removidos - agora no componente BonusChest
  // --- ESTILOS DO MASCOTE LATERAL ---
  illustrationContainer: {
    position: 'absolute', 
    width: 160, // Aumentei o tamanho para melhor visualização
    height: 200,
    top: -170, // Ajusta a altura da imagem em relação à bolinha
    zIndex: 5,
  },
  illustrationLeft: {
    right: '50%', 
    marginRight: 40, // Distância do centro
  },
  illustrationRight: {
    left: '50%', 
    marginLeft: 60, // Distância do centro
  },
  illustrationImage: {
    width: '100%', 
    height: '100%',
    resizeMode: 'contain',
  }
})