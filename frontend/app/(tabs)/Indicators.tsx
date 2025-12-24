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
import { formatName } from '../../utils/formatName';

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

    // Module distribution (Bar Chart)
    const moduleLabels = Object.keys(metrics.moduleCount).slice(0, 5);
    const moduleData = moduleLabels.map(label => metrics.moduleCount[label]);

    return {
      statusPie: statusLabels.map((label, index) => ({
        name: label.length > 15 ? label.substring(0, 15) + '...' : label,
        population: statusData[index],
        color: statusColors[index % statusColors.length],
        legendFontColor: COLORS.text,
        legendFontSize: 11,
      })),
      moduleBar: {
        labels: moduleLabels.map(l => l.length > 10 ? l.substring(0, 10) + '...' : l),
        datasets: [{
          data: moduleData,
        }],
      },
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

      {/* Gráfico de Módulos */}
      {chartData.moduleBar.labels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chamados por Módulo</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData.moduleBar}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: COLORS.card,
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => COLORS.primary,
                labelColor: (opacity = 1) => COLORS.text,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
              }}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        </View>
      )}

      {/* Tabela de Ocorrências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ocorrências do Dia</Text>
        <Text style={styles.sectionDescription}>
          Histórico das ocorrências com status, datas e SLA
        </Text>
        
        {displayTickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum ticket encontrado.</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            {displayTickets.slice(0, 10).map((ticket, index) => {
              const age = calculateDays(ticket['Data de Criação']);
              const isOpen = ticket['Data de Finalização'] === '00-00-0000';
              const isCritical = isOpen && age > 7;
              
              return (
                <View key={`${ticket['N° Chamado']}-${index}`} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Chamado</Text>
                    <Text style={styles.tableCellValue}>{ticket['N° Chamado']}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Cliente</Text>
                    <Text style={styles.tableCellValue} numberOfLines={1}>
                      {ticket['Fantasia'] || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Status</Text>
                    <View style={[
                      styles.statusBadge,
                      ticket['SLA de Solução'] === 'Em Dia' ? styles.statusGood : styles.statusWarning
                    ]}>
                      <Text style={styles.statusText}>{ticket['Nome do Status']}</Text>
                    </View>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>Idade</Text>
                    <Text style={[
                      styles.tableCellValue,
                      isCritical && { color: COLORS.danger, fontWeight: 'bold' }
                    ]}>
                      {age}d
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellLabel}>SLA</Text>
                    <Text style={[
                      styles.tableCellValue,
                      ticket['SLA de Solução'] === 'Em Dia' ? { color: COLORS.success } : { color: COLORS.danger }
                    ]}>
                      {ticket['SLA de Solução']}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Resumo */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Status: {Object.entries(metrics.statusCount).map(([status, count]) => `${count} ${status}`).join(' - ')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Chamados com SLA crítico: {metrics.criticalTickets}. 
            {metrics.criticalTickets > 0 ? ' Risco moderado de glosa.' : ' Sem riscos.'}
          </Text>
        </View>
      </View>

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
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
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
});
