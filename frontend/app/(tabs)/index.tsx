import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { formatName } from "../../utils/formatName";

// Definição dos tipos para maior clareza
type Mission = {
  id: string;
  title: string;
  points: string;
  screen?: 'editProfile' | 'quiz' | string;
};

type Item = Mission | { id: string; type: 'chest'; points: number; opened: boolean };

// Missões originais
const ORIGINAL_MISSIONS: Mission[] = [
  { id: 'profile', title: 'Preencha seu perfil', points: '+10 pontos', screen: 'editProfile' },
  { id: '2', title: 'Participe de um desafio', points: '+20 pontos', screen: 'quiz' },
  { id: '3', title: 'Compre conteúdo', points: '+15 pontos' },
  { id: '4', title: 'Ganhe um super desconto', points: '+15 pontos' },
  { id: '5', title: 'Revise o conteúdo da semana', points: '+5 pontos' },
  { id: '6', title: 'Convide um amigo', points: '+25 pontos' },
  { id: '7', 'title': 'Complete 3 missões', points: '+30 pontos' },
  { id: '8', title: 'Faça login por 7 dias', points: '+50 pontos' },
  { id: '9', title: 'Avalie o app', points: '+15 pontos' },
  { id: '10', title: 'Compartilhe nas redes', points: '+20 pontos' },
];

// --- COMPONENTES VISUAIS AUXILIARES ---

// 1. Mascote da OSM (Substitua este SVG/Ícone pelo seu mascote real)
const MascoteOSM = () => (
  <View style={styles.mascoteContainer}>
    <Ionicons name="sparkles-sharp" size={30} color="#FFD700" />
    <Text style={styles.mascoteText}>Seu MentoRH</Text>
  </View>
);

// 2. Baú de Bônus (ATUALIZADO PARA USAR ÍCONE DE CHECK QUANDO ABERTO)
const BonusChestItem = ({ chest, onOpen, isLocked }: { chest: any, onOpen: (id: string) => void, isLocked: boolean }) => {
    const isOpened = chest.opened;
    
    let color = '#FF9800'; // Laranja padrão
    let icon; // Usaremos um componente aqui para flexibilidade
    let opacity = 1;

    if (isOpened) {
        color = '#4a7f37'; // Verde escuro para indicar conclusão/aberto
        opacity = 1;
        // ÍCONE DE CHECK QUANDO ABERTO (Ionicons)
        icon = <Ionicons name="checkmark-circle" size={36} color="#fff" />;
    } else if (isLocked) {
        color = '#B0B0B0'; // Cinza para bloqueado
        opacity = 0.6;
        icon = <MaterialCommunityIcons name="lock-outline" size={36} color="#fff" />;
    } else {
        // ÍCONE DE BAÚ QUANDO DISPONÍVEL
        icon = <MaterialCommunityIcons name="treasure-chest" size={36} color="#fff" />;
    }
    
    return (
        <View style={styles.chestWrapper}>
            <TouchableOpacity
                style={[styles.chestButton, { backgroundColor: color, opacity: opacity }]}
                onPress={() => onOpen(chest.id)}
                disabled={isOpened || isLocked}
            >
                {/* Renderiza o ícone determinado pela lógica */}
                {icon} 
                <Text style={styles.chestText}>
                    {isOpened ? 'Resgatado!' : (isLocked ? 'Baú Bloqueado' : `BÔNUS +${chest.points} XP`)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// --- TELA PRINCIPAL E LÓGICA ---

export default function HomeScreen() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [bonusChestState, setBonusChestState] = useState({ id: 'chest_1', type: 'chest', points: 10, opened: false });
  const router = useRouter();
  const { user } = useAuth();

  // Função que checa o status no contexto (usada para missões)
  const isMissionCompleted = (missionId: string) => {
    // Simulação do backend:
    if (missionId === 'profile') {
      return user?.missionsCompleted?.includes('profile') === true || user?.profileMissionCompleted === true;
    }
    if (missionId === '2') {
      return user?.missionsCompleted?.includes('quiz2') === true;
    }
    return false;
  };

  // Lógica para verificar se o baú está bloqueado
  const isChestLocked = () => {
    const missionProfileCompleted = isMissionCompleted('profile');
    const mission2Completed = isMissionCompleted('2');
    
    return !(missionProfileCompleted && mission2Completed);
  };
  
  // 1. FUNÇÃO DE CLIQUE: Alterna o balão de informação
  const handleMissionPress = (missionId: string) => {
    setSelectedMissionId(selectedMissionId === missionId ? null : missionId);
  };
  
  // 2. AÇÃO PARA ABRIR O BAÚ
  const handleOpenChest = (id: string) => {
    if (isChestLocked()) {
        alert('Conclua as missões anteriores para abrir este baú!');
        return;
    }
      
    if (!bonusChestState.opened) {
      alert(`Parabéns! Você ganhou ${bonusChestState.points} pontos de bônus!`); 
      setBonusChestState(prev => ({ ...prev, opened: true }));
    }
  };

  // 3. AÇÕES DE NAVEGAÇÃO
  const handleAction = (mission: Mission) => {
    if (isMissionCompleted(mission.id)) return;

    if (mission.screen === 'editProfile') {
      router.push('/editProfile');
    } else if (mission.screen === 'quiz') {
      router.push('/quiz' as any); // Assumindo que '/quiz' é a rota
    } else {
      alert(`Iniciando missão: ${mission.title}`);
    }
    setSelectedMissionId(null); // Fecha o balão após iniciar a ação
  };

  // 4. CONSTRÓI A LISTA FINAL DE ITENS (MISSÕES + BAÚ)
  const renderItems = () => {
    const items: Item[] = [];
    
    ORIGINAL_MISSIONS.forEach((mission, index) => {
        items.push(mission);
        
        // Insere o baú após as duas primeiras missões (índices 0 e 1)
        if (index === 1) {
            items.push(bonusChestState);
        }
    });
    return items;
  };

  const chestLockedStatus = isChestLocked(); // Calcula o status de bloqueio do baú

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
          {/* Adiciona o Mascote aqui */}
          <View style={styles.mascoteWrapper}>
              <MascoteOSM />
          </View>
        </View>

        {/* Container das missões (Trilha) */}
        <View style={styles.missionsContainer}>
          {/* Linha central - MAIS GROSSA E ESTILIZADA */}
          <View style={styles.centralLine} />

          {/* Renderiza todos os itens (Missões e Baú) */}
          {renderItems().map((item, index) => {
            if (item.type === 'chest') {
              // Item especial: Baú de Bônus
              return (
                <BonusChestItem 
                    key={item.id} 
                    chest={item} 
                    onOpen={handleOpenChest} 
                    isLocked={chestLockedStatus}
                />
              );
            }
            
            // Item de Missão: Deve ter numeração sequencial
            const mission = item as Mission;
            const isCompleted = isMissionCompleted(mission.id);
            const isSelected = selectedMissionId === mission.id;
            
            // Calculamos o índice da missão dentro da lista ORIGINAL_MISSIONS
            const missionIndex = ORIGINAL_MISSIONS.findIndex(m => m.id === mission.id);
            const displayMissionNumber = missionIndex + 1; // 1, 2, 3, ...
            
            // Lógica de desbloqueio simples: a missão só é acessível se a anterior (da lista ORIGINAL) foi completa.
            let isPreviousCompleted = false;
            if (missionIndex === 0) {
              isPreviousCompleted = true; // Primeira missão sempre acessível
            } else if (missionIndex === 2) {
              // A 3ª missão (index 2) só é liberada se o baú (index 1 da lista items) foi aberto.
              isPreviousCompleted = bonusChestState.opened;
            } else if (missionIndex > 2) {
              // Para as missões a partir da 4ª (index > 2), olhamos para a missão ORIGINAL anterior.
              isPreviousCompleted = isMissionCompleted(ORIGINAL_MISSIONS[missionIndex - 1].id);
            } else {
              // Segunda missão (index 1)
              isPreviousCompleted = isMissionCompleted(ORIGINAL_MISSIONS[missionIndex - 1].id);
            }


            const isLocked = !isCompleted && !isPreviousCompleted;


            // A bolinha (Node) é renderizada no centro.
            return (
              <View
                key={mission.id}
                style={styles.missionNodeWrapper}
              >
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
                      // NOVO: ÍCONE DE CHECK DO IONICONS para missões concluídas
                      <Ionicons name="checkmark" size={40} color="#fff" />
                  ) : (
                      <Text style={styles.missionNumber}>
                          {displayMissionNumber}
                      </Text>
                  )}
                </TouchableOpacity>

                {/* Balão de informações da missão (Abre ao clicar) */}
                {isSelected && (
                  <View style={[
                      styles.missionInfo,
                      // Posiciona o balão à direita do círculo
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
          
          {/* Espaço extra no final para rolagem */}
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
    backgroundColor: '#fff', // Fundo mais limpo
    paddingBottom: 250, // Aumentado para garantir espaço
  },
  // --- HEADER / GREETING ---
  greetingSectionMentorh: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#379a4a', // Cor verde Duolingo (ajustada para um tom mais vibrante)
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
    paddingTop: 70, // Espaço para a primeira bolinha
    minHeight: 2000, // Aumenta a altura mínima da trilha
  },
  centralLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8, // Linha mais grossa
    backgroundColor: '#4a7f3730', // Cor verde Duolingo, mas transparente
    borderRadius: 4,
  },
  missionNodeWrapper: {
    width: '100%',
    alignItems: 'center',
    // AUMENTADO PARA 100 para evitar sobreposição
    marginBottom: 170, 
    position: 'relative',
    minHeight: 65, // Garante que a bolinha caiba
  },
  // Círculo Principal (Bolinha)
  missionCircle: {
    width: 65, // Bolinha maior
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#7acb85', // Verde mais claro/amigável
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff', // Borda branca para destacar na linha
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  completedCircle: {
    backgroundColor: '#4a7f37', // Verde escuro de conclusão
    opacity: 1,
  },
  lockedCircle: {
    backgroundColor: '#ccc', // Cinza para bloqueado
    opacity: 0.7,
  },
  missionNumber: {
    fontSize: 28, // Número maior
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
    // Posiciona o balão à direita do círculo
    marginTop: 70,
    marginRight: 60,
    zIndex: 5,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#292a2b',
    marginBottom: 8,
    textAlign: 'center',
  },
  btnMission: {
    backgroundColor: '#379a4a', // Cor de CTA vibrante
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
  // --- BAÚ DE BÔNUS (Inserido na trilha) ---
  chestWrapper: {
    width: '100%',
    alignItems: 'center',
    // AUMENTADO PARA 100 para evitar sobreposição
    marginBottom: 150, 
    zIndex: 10, // Garante que o baú esteja sobre a linha
  },
  chestButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D32F2F', // Sombra vermelha/laranja para destaque
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  chestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
  },
  bottomSpacer: {
    height: 100,
  },
});