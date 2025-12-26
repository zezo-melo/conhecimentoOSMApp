import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INDICATORS_BFF_URL, API_URL } from '../../constants';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

interface Ticket {
  'N° Chamado': string;
  'Data de Criação': string;
  'Data de Finalização': string;
  'Fantasia': string;
  'Nome do Status': string;
  'Nome Completo do Operador': string;
  'Nome do Grupo': string;
  'SLA de Solução': string;
  'Tipo de Ocorrência': string;
  'Módulo': string;
}

interface DashboardData {
  tickets: Ticket[];
}

// Paleta de cores do app
const COLORS = {
  primary: '#4a7f37',
  primaryDark: '#2e7d32',
  primaryLight: '#66bb6a',
  secondary: '#1a5d2b',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3',
  border: '#e0e0e0',
};

const screenWidth = Dimensions.get('window').width;

// ============================================
// TOKEN DO BFF DE INDICADORES
// ============================================
// Para atualizar o token, substitua o valor abaixo pelo novo token do Postman
// Exemplo: const INDICATORS_BFF_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
// Deixe como null para usar o token do app principal
const INDICATORS_BFF_TOKEN: string | null = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmVydG8ubWVsb0Bvc20uY29tLmJyIiwibmFtZSI6Ikpvc8OpIFJvYmVydG8gRmVycmVpcmEgTWVsbyIsImlhdCI6MTc2Njc1NTIwMCwiZXhwIjoxNzY2Nzg0MDAwfQ.pgvk9JdYgqPqi2kLKzgWEHDU1_Md7ujnUG38YJewofc';

// Função para normalizar nomes
const normalizeName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
};

const matchName = (name1: string, name2: string): boolean => {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  if (normalized1 === normalized2) return true;
  
  const parts1 = normalized1.split(' ');
  const parts2 = normalized2.split(' ');
  
  if (parts1.length >= 2 && parts2.length >= 2) {
    const firstLast1 = `${parts1[0]} ${parts1[parts1.length - 1]}`;
    const firstLast2 = `${parts2[0]} ${parts2[parts2.length - 1]}`;
    if (firstLast1 === firstLast2) return true;
  }
  
  if (parts1[0] && parts2[0] && parts1[0] === parts2[0]) {
    return true;
  }
  
  return false;
};

// Função para calcular dias entre datas
const calculateDays = (dateStr: string): number => {
  if (!dateStr || dateStr === '00-00-0000') return 0;
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function IndicatorsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [userRanking, setUserRanking] = useState<{ position: number; points: number } | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [newToken, setNewToken] = useState('');

  // Função para buscar ranking do usuário
  useEffect(() => {
    const fetchUserRanking = async () => {
      try {
        const token = await AsyncStorage.getItem('@AppBeneficios:token');
        if (!token) return;

        const res = await fetch(`${API_URL}/leaderboard?limit=1&skip=0`, {
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.me) {
            setUserRanking({
              position: data.me.position,
              points: data.me.points || 0,
            });
          }
        }
      } catch (error) {
        console.log('Erro ao buscar ranking:', error);
      }
    };

    fetchUserRanking();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prioridade: 1) Token definido no código, 2) Token do AsyncStorage, 3) Token do app
        let token = INDICATORS_BFF_TOKEN;
        
        if (!token) {
          token = await AsyncStorage.getItem('@AppBeneficios:indicatorsToken');
        }
        
        if (!token) {
          token = await AsyncStorage.getItem('@AppBeneficios:token');
        }
        
        if (!token) {
          setError('Token de autenticação não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const url = `${INDICATORS_BFF_URL}/api/dashboard-data`;
        console.log('🌐 [Indicators] Buscando dados de:', url);
        
        let response;
        try {
          response = await axios.get<DashboardData>(url, {
            timeout: 15000,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (firstError: any) {
          if (firstError.response?.status === 404) {
            console.log('🔄 [Indicators] Tentando sem /api...');
            const urlWithoutApi = `${INDICATORS_BFF_URL}/dashboard-data`;
            response = await axios.get<DashboardData>(urlWithoutApi, {
              timeout: 15000,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } else {
            throw firstError;
          }
        }

        console.log('✅ [Indicators] Dados recebidos:', response.data);

        if (response.data && response.data.tickets) {
          const tickets = response.data.tickets;
          setAllTickets(tickets);

          if (user?.name) {
            console.log('🔍 [Indicators] Filtrando tickets para:', user.name);
            const filtered = tickets.filter(ticket => 
              matchName(ticket['Nome Completo do Operador'], user.name)
            );
            console.log(`📊 [Indicators] Encontrados ${filtered.length} tickets para ${user.name}`);
            setUserTickets(filtered);
          } else {
            setUserTickets(tickets);
          }
        } else {
          setError('Formato de resposta inesperado da API.');
        }
      } catch (err: any) {
        console.error('❌ [Indicators] Erro ao buscar dados:', err);
        
        if (err.response?.status === 401) {
          setError('Token inválido ou expirado. Faça login novamente.');
        } else if (err.response?.status === 403) {
          setError('Acesso negado. O token do app não tem permissão no BFF de indicadores.');
        } else if (err.response?.status === 404) {
          setError(`Endpoint não encontrado (404).`);
        } else if (err.code === 'ECONNABORTED') {
          setError('Tempo de espera esgotado. Tente novamente.');
        } else if (err.message?.includes('Network Error') || err.code === 'ERR_NETWORK') {
          setError('Erro de conexão. Verifique sua internet ou se o servidor está online.');
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados dos indicadores.';
          setError(`Erro: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.name]);

  // Função para salvar novo token
  const handleSaveToken = async () => {
    if (!newToken.trim()) {
      Alert.alert('Erro', 'Por favor, insira um token válido.');
      return;
    }

    try {
      await AsyncStorage.setItem('@AppBeneficios:indicatorsToken', newToken.trim());
      Alert.alert('Sucesso', 'Token salvo! Recarregando dados...');
      setShowTokenInput(false);
      setNewToken('');
      // Recarrega os dados
      setLoading(true);
      setError(null);
      // Força re-render do useEffect
      const fetchData = async () => {
        let token = await AsyncStorage.getItem('@AppBeneficios:indicatorsToken');
        if (!token) {
          token = await AsyncStorage.getItem('@AppBeneficios:token');
        }
        
        if (!token) {
          setError('Token de autenticação não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const url = `${INDICATORS_BFF_URL}/api/dashboard-data`;
        console.log('🌐 [Indicators] Buscando dados de:', url);
        
        let response;
        try {
          response = await axios.get<DashboardData>(url, {
            timeout: 15000,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (firstError: any) {
          if (firstError.response?.status === 404) {
            console.log('🔄 [Indicators] Tentando sem /api...');
            const urlWithoutApi = `${INDICATORS_BFF_URL}/dashboard-data`;
            response = await axios.get<DashboardData>(urlWithoutApi, {
              timeout: 15000,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } else {
            throw firstError;
          }
        }

        console.log('✅ [Indicators] Dados recebidos:', response.data);

        if (response.data && response.data.tickets) {
          const tickets = response.data.tickets;
          setAllTickets(tickets);

          if (user?.name) {
            console.log('🔍 [Indicators] Filtrando tickets para:', user.name);
            const filtered = tickets.filter(ticket => 
              matchName(ticket['Nome Completo do Operador'], user.name)
            );
            console.log(`📊 [Indicators] Encontrados ${filtered.length} tickets para ${user.name}`);
            setUserTickets(filtered);
          } else {
            setUserTickets(tickets);
          }
        } else {
          setError('Formato de resposta inesperado da API.');
        }
      };
      fetchData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o token.');
    }
  };

  // Função para determinar nível baseado em pontos
  const mapLevel = (points: number): string => {
    if (points >= 700) return 'Diamante';
    if (points >= 400) return 'Ouro';
    if (points >= 200) return 'Prata';
    return 'Bronze';
  };

  // Cálculo de métricas
  const metrics = useMemo(() => {
    const tickets = userTickets.length > 0 ? userTickets : allTickets;
    
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t['Data de Finalização'] === '00-00-0000').length;
    const closedTickets = totalTickets - openTickets;
    
    // Status distribution
    const statusCount: Record<string, number> = {};
    tickets.forEach(ticket => {
      const status = ticket['Nome do Status'];
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // SLA analysis
    const slaEmDia = tickets.filter(t => t['SLA de Solução'] === 'Em Dia').length;
    const slaPercent = totalTickets > 0 ? Math.round((slaEmDia / totalTickets) * 100) : 0;

    // Average age
    const openTicketsWithAge = tickets
      .filter(t => t['Data de Finalização'] === '00-00-0000')
      .map(t => calculateDays(t['Data de Criação']));
    const avgAge = openTicketsWithAge.length > 0
      ? (openTicketsWithAge.reduce((a, b) => a + b, 0) / openTicketsWithAge.length).toFixed(1)
      : '0';

    // Critical tickets (> 7 days)
    const criticalTickets = openTicketsWithAge.filter(age => age > 7).length;

    // Module distribution
    const moduleCount: Record<string, number> = {};
    tickets.forEach(ticket => {
      const module = ticket['Módulo'] || 'Sem módulo';
      moduleCount[module] = (moduleCount[module] || 0) + 1;
    });

    // Produtividade (baseada em tickets fechados e pontos do usuário)
    const productivityToday = closedTickets * 10; // Exemplo: 10 pts por ticket fechado
    const productivity30d = Math.round(productivityToday * 0.9); // Aproximação

    // Determinar medalha baseada em pontos do usuário
    const userPoints = user?.points || 0;
    let medal = 'Bronze';
    let medalTop = '';
    if (userPoints >= 200) {
      medal = 'Ouro';
      medalTop = 'Top 15%';
    } else if (userPoints >= 100) {
      medal = 'Prata';
      medalTop = 'Top 30%';
    }

    // Determinar cargo baseado no grupo dos tickets
    const grupos = tickets.map(t => t['Nome do Grupo']).filter(Boolean);
    const grupoMaisComum = grupos.length > 0 
      ? grupos.sort((a, b) => 
          grupos.filter(g => g === a).length - grupos.filter(g => g === b).length
        ).pop() || ''
      : '';
    
    let cargo = 'Colaborador';
    if (grupoMaisComum.includes('N1') || grupoMaisComum.includes('N2')) {
      cargo = `Analista de Suporte ${grupoMaisComum.includes('N1') && grupoMaisComum.includes('N2') ? 'N1/N2' : grupoMaisComum.includes('N1') ? 'N1' : 'N2'}`;
    }

    return {
      totalTickets,
      openTickets,
      closedTickets,
      statusCount,
      slaPercent,
      avgAge,
      criticalTickets,
      moduleCount,
      productivityToday,
      productivity30d,
      medal,
      medalTop,
      cargo,
      grupoMaisComum,
    };
  }, [userTickets, allTickets]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    // Status distribution (Pie Chart)
    const statusLabels = Object.keys(metrics.statusCount);
    const statusData = Object.values(metrics.statusCount);
    const statusColors = [
      COLORS.primary,
      COLORS.info,
      COLORS.warning,
      COLORS.danger,
      COLORS.success,
      '#9c27b0',
    ];

    return {
      statusPie: statusLabels.map((label, index) => ({
        name: label.length > 15 ? label.substring(0, 15) + '...' : label,
        population: statusData[index],
        color: statusColors[index % statusColors.length],
        legendFontColor: COLORS.text,
        legendFontSize: 11,
      })),
    };
  }, [metrics]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.text }}>Carregando indicadores...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Header />
        <Text style={styles.title}>Meus Indicadores</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          
          {(error.includes('403') || error.includes('Acesso negado') || error.includes('Token')) && (
            <View style={styles.tokenUpdateContainer}>
              <Text style={styles.tokenUpdateHint}>
                O token do BFF pode ter expirado. Você pode atualizar o token aqui:
              </Text>
              
              {!showTokenInput ? (
                <TouchableOpacity 
                  style={styles.tokenButton}
                  onPress={() => setShowTokenInput(true)}
                >
                  <Text style={styles.tokenButtonText}>Atualizar Token do BFF</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.tokenInputContainer}>
                  <Text style={styles.tokenInput}
                    placeholder="Cole o novo token aqui..."
                    placeholderTextColor={COLORS.textMuted}
                    value={newToken}
                    onChangeText={setNewToken}
                    multiline
                    autoCapitalize="none"
                    secureTextEntry={false}
                  />
                  <View style={styles.tokenButtonsRow}>
                    <TouchableOpacity 
                      style={[styles.tokenButton, styles.tokenButtonSecondary]}
                      onPress={() => {
                        setShowTokenInput(false);
                        setNewToken('');
                      }}
                    >
                      <Text style={[styles.tokenButtonText, { color: COLORS.text }]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.tokenButton}
                      onPress={handleSaveToken}
                    >
                      <Text style={styles.tokenButtonText}>Salvar Token</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  const displayTickets = userTickets.length > 0 ? userTickets : allTickets;
  const displayName = user?.name || 'Todos os usuários';
  const userInitial = user?.name?.charAt(0).toUpperCase() || '?';
  const userPoints = user?.points || 0;
  const userLevel = mapLevel(userPoints); // Adicione esta linha

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      
      {/* Header do Dashboard - Estilo do Print */}
      <View style={styles.dashboardHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>PAINEL INTELIGENTE</Text>
            <Text style={styles.headerSubtitle}>OSM</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Visão por operador</Text>
          </TouchableOpacity>
        </View>

        {/* Perfil do Usuário */}
        <View style={styles.profileSection}>
          {/* Avatar com borda verde brilhante */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          </View>

          {/* Nome Completo */}
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userRole}>{metrics.cargo} {metrics.grupoMaisComum ? `- ${metrics.grupoMaisComum}` : ''}</Text>

          {/* Ranking e Nível */}
          <View style={styles.rankingContainer}>
            {userRanking && (
              <View style={styles.rankingBadge}>
                <Text style={styles.rankingLabel}>Ranking</Text>
                <Text style={styles.rankingValue}>#{userRanking.position}</Text>
              </View>
            )}
            <View style={styles.levelBadge}>
              <Text style={styles.levelLabel}>Nível</Text>
              <Text style={styles.levelValue}>{userLevel}</Text>
            </View>
          </View>

          {/* Métricas Compactas */}
          <View style={styles.metricsCompact}>
            <View style={styles.metricCompact}>
              <Text style={styles.metricCompactLabel}>Chamados Ativos</Text>
              <Text style={styles.metricCompactValue}>{metrics.openTickets}</Text>
            </View>
            <View style={styles.metricCompact}>
              <Text style={styles.metricCompactLabel}>SLA</Text>
              <Text style={[styles.metricCompactValue, { 
                color: metrics.slaPercent >= 90 ? COLORS.success : COLORS.danger 
              }]}>
                {metrics.slaPercent}%
              </Text>
            </View>
            <View style={styles.metricCompact}>
              <Text style={styles.metricCompactLabel}>Produtividade</Text>
              <Text style={styles.metricCompactValue}>{metrics.productivityToday} pts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cards de Métricas Principais */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total de Chamados</Text>
          <Text style={styles.metricValue}>{metrics.totalTickets}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Em Aberto</Text>
          <Text style={[styles.metricValue, { color: COLORS.warning }]}>{metrics.openTickets}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>SLA</Text>
          <Text style={[styles.metricValue, { color: metrics.slaPercent >= 90 ? COLORS.success : COLORS.danger }]}>
            {metrics.slaPercent}%
          </Text>
        </View>
      </View>

      {/* Produtividade e Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtividade & Status</Text>
        <View style={styles.productivityGrid}>
          <View style={styles.productivityCard}>
            <Text style={styles.productivityLabel}>Chamados Encerrados</Text>
            <Text style={styles.productivityValue}>{metrics.closedTickets}</Text>
          </View>
          <View style={styles.productivityCard}>
            <Text style={styles.productivityLabel}>Idade Média</Text>
            <Text style={styles.productivityValue}>{metrics.avgAge} dias</Text>
          </View>
          <View style={styles.productivityCard}>
            <Text style={styles.productivityLabel}>Críticos (>7 dias)</Text>
            <Text style={[styles.productivityValue, { color: metrics.criticalTickets > 0 ? COLORS.danger : COLORS.success }]}>
              {metrics.criticalTickets}
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfico de Distribuição de Status */}
      {chartData.statusPie.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição de Status</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData.statusPie}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}

      {/* Tabela de Ocorrências - Estilo do Print */}
      {displayTickets.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ocorrências do dia - N1/N2</Text>
          <Text style={styles.sectionDescription}>
            Histórico das ocorrências com status, datas, SLA, risco de glosa e estimativa de fechamento com base em histórico.
          </Text>
          
          {/* Cabeçalho da Tabela */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>ID</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>CLIENTE</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>MÓDULO</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.3 }]}>STATUS</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>CRIAÇÃO</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>ÚLT. ATUALIZAÇÃO</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>SLA</Text>
          </View>

          {/* Linhas da Tabela */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {displayTickets.slice(0, 10).map((ticket, index) => {
                const age = calculateDays(ticket['Data de Criação']);
                const isOpen = ticket['Data de Finalização'] === '00-00-0000';
                const isCritical = isOpen && age > 7;
                const isExpired = ticket['SLA de Solução'] !== 'Em Dia';
                
                // Formata data para exibição
                const formatDate = (dateStr: string) => {
                  if (!dateStr || dateStr === '00-00-0000') return '-';
                  const [day, month] = dateStr.split('-');
                  return `${day}/${month}`;
                };
                
                // Determina cor do status
                const getStatusColor = (status: string) => {
                  if (status.includes('análise') || status.includes('fila')) {
                    return COLORS.info;
                  } else if (status.includes('homologação')) {
                    return COLORS.success;
                  } else if (status.includes('Aguardando') || status.includes('aguardando')) {
                    return COLORS.warning;
                  }
                  return COLORS.textLight;
                };

                return (
                  <View key={`${ticket['N° Chamado']}-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 0.8, fontWeight: '600' }]}>
                      {ticket['N° Chamado']}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]} numberOfLines={1}>
                      {ticket['Fantasia'] || 'N/A'}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>
                      {ticket['Módulo'] || 'Sem módulo'}
                    </Text>
                    <View style={[styles.tableCell, { flex: 1.3 }]}>
                      <View style={[
                        styles.statusPill,
                        { backgroundColor: getStatusColor(ticket['Nome do Status']) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusPillText,
                          { color: getStatusColor(ticket['Nome do Status']) }
                        ]}>
                          {ticket['Nome do Status']}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, { flex: 1, fontSize: 11 }]}>
                      {formatDate(ticket['Data de Criação'])}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.2, fontSize: 11 }]}>
                      {isOpen ? formatDate(ticket['Data de Criação']) : formatDate(ticket['Data de Finalização'])}
                    </Text>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <View style={[
                        styles.slaPill,
                        isExpired ? styles.slaExpired : styles.slaGood
                      ]}>
                        <Text style={[
                          styles.slaPillText,
                          isExpired && { color: COLORS.danger }
                        ]}>
                          {ticket['SLA de Solução'] === 'Em Dia' 
                            ? `SLA ${metrics.slaPercent}% - ${age}d`
                            : `SLA ${metrics.slaPercent}% - vencido`}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Resumo */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Status: {Object.entries(metrics.statusCount).map(([status, count]) => `${count} ${status.toLowerCase()}`).join(' - ')}
            </Text>
            <Text style={styles.summaryText}>
              Chamados com SLA crítico: {metrics.criticalTickets}. {metrics.criticalTickets > 0 ? 'Risco moderado de glosa.' : 'Sem riscos.'}
            </Text>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  metricsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  productivityGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  productivityCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  productivityLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
    textAlign: 'center',
  },
  productivityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
    paddingRight: 10,
  },
  tableContainer: {
    marginTop: 8,
  },
  tableRow: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tableCell: {
    marginBottom: 6,
  },
  tableCellLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  tableCellValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusGood: {
    backgroundColor: '#c8e6c9',
  },
  statusWarning: {
    backgroundColor: '#ffccbc',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  summarySection: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 12,
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    marginBottom: 12,
  },
  tokenUpdateContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  tokenUpdateHint: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 18,
  },
  tokenInputContainer: {
    gap: 8,
  },
  tokenInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  tokenButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tokenButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  tokenButtonSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dashboardHeader: {
    backgroundColor: COLORS.card, // Branco
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  viewButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  rankingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rankingBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankingLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  rankingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  levelBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  levelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  metricsCompact: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  metricCompact: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricCompactLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricCompactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    minWidth: screenWidth - 80,
  },
  tableCell: {
    fontSize: 12,
    color: COLORS.text,
    paddingHorizontal: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  slaPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  slaGood: {
    backgroundColor: COLORS.success + '20',
  },
  slaExpired: {
    backgroundColor: COLORS.danger + '20',
  },
  slaPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.success,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    gap: 8,
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
});
