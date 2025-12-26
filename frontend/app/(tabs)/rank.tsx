import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { API_URL } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Importação da função formatName
import { formatName } from "../../utils/formatName";

type RankItem = {
  position: number;
  name: string;
  points: number;
  photoUrl?: string | null;
};

function mapLevel(points: number): string {
  if (points >= 700) return 'Diamante';
  if (points >= 400) return 'Ouro';
  if (points >= 200) return 'Prata';
  return 'Bronze';
}

export default function RankScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<RankItem[]>([]);
  const [me, setMe] = useState<RankItem | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem('@AppBeneficios:token');
        if (!token) {
          setError('Usuário não autenticado. Faça login novamente.');
          setLoading(false);
          return;
        }
        
        // A API_URL já inclui /api, então não precisa adicionar novamente
        const url = `${API_URL}/leaderboard?limit=${pageSize}&skip=0`;
        console.log('🌐 [Rank] Buscando ranking de:', url);
        console.log('🔑 [Rank] Token:', token.substring(0, 20) + '...');
        
        const res = await fetch(url, {
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
          },
        });
        
        console.log('📡 [Rank] Status da resposta:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ [Rank] Erro na resposta:', res.status, errorText);
          
          // Tratamento mais detalhado de erros
          if (res.status === 401) {
            throw new Error('Token inválido ou expirado. Faça login novamente.');
          } else if (res.status === 403) {
            throw new Error('Acesso negado. Verifique suas permissões.');
          } else if (res.status === 404) {
            throw new Error('Endpoint não encontrado. Verifique a configuração da API.');
          } else if (res.status === 500) {
            throw new Error('Erro no servidor. Tente novamente mais tarde.');
          } else {
            throw new Error(`Erro ao carregar ranking (${res.status}). Tente novamente.`);
          }
        }
        
        const data = await res.json();
        console.log('✅ [Rank] Dados recebidos:', {
          leaderboardCount: data.leaderboard?.length || 0,
          hasMe: !!data.me,
          total: data.total
        });
        
        setLeaderboard(data.leaderboard || []);
        setMe(data.me || null);
        setTotal(data.total || 0);
      } catch (e: any) {
        console.error('❌ [Rank] Erro completo ao buscar ranking:', e);
        setError(e.message || 'Erro ao carregar ranking');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || leaderboard.length >= total) return;
    try {
      setIsFetchingMore(true);
      const token = await AsyncStorage.getItem('@AppBeneficios:token');
      if (!token) {
        console.error('Token não encontrado ao carregar mais');
        return;
      }
      
      const res = await fetch(
        `${API_URL}/leaderboard?limit=${pageSize}&skip=${leaderboard.length}`,
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        }
      );
      
      if (!res.ok) {
        console.error('Erro ao carregar mais:', res.status);
        return; // Silenciosamente falha, não mostra erro para o usuário
      }
      
      const data = await res.json();
      setLeaderboard((prev) => [...prev, ...(data.leaderboard || [])]);
      setTotal(data.total || total);
    } catch (error) {
      console.error('Erro ao carregar mais ranking:', error);
      // Não mostra erro para o usuário ao carregar mais
    } finally {
      setIsFetchingMore(false);
    }
  }, [leaderboard.length, total, isFetchingMore]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 60;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      handleLoadMore();
    }
  };

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const rest = useMemo(() => leaderboard.slice(3), [leaderboard]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator color="#4a7f37" />
          </View>
        )}
        {error && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            <Text style={{ color: '#c00' }}>{error}</Text>
          </View>
        )}

        <View style={styles.headerSection}>
          <Text style={styles.titleText}>🏆 Ranking de Pontos</Text>
          <Text style={styles.subtitleText}>Veja quem está liderando o ranking</Text>
        </View>

        {/* Pódio Top 3 */}
        {top3.length > 0 && (
          <View style={styles.podiumContainer}>
            {top3.map((item, index) => {
              const hasPhoto = !!item.photoUrl;
              const placeStyle =
                index === 0
                  ? styles.firstPlace
                  : index === 1
                  ? styles.secondPlace
                  : styles.thirdPlace;

              return (
                <View
                  key={item.position}
                  style={[
                    styles.podiumItem,
                    index === 0 && styles.first,
                    index === 1 && styles.second,
                    index === 2 && styles.third,
                  ]}
                >
                  <Text style={styles.positionLabel}>{`${item.position}º lugar`}</Text>

                      <Avatar name={item.name} size={80} style={styles.avatarCircle} textStyle={styles.initial as any} />

                  <Text 
                    style={styles.podiumName}
                    numberOfLines={1} // Garante no máximo 1 linha
                    ellipsizeMode='tail' // Adiciona "..." se cortar
                  >
                    {formatName(item.name)} {/* <--- Nome formatado e limitado */}
                  </Text>
                  <Text style={styles.podiumPoints}>{item.points} pts</Text>
                  <Text style={styles.podiumLevel}>{mapLevel(item.points)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {me && (
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ color: '#666', marginBottom: 8 }}>Sua posição</Text>
            <View style={styles.rankingItem}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{me.position}</Text>
              </View>
              <Avatar name={me.name as string} size={36} style={styles.avatarThumb} />
              <View style={styles.userInfo}>
                <Text 
                  style={styles.userName}
                  numberOfLines={1} 
                  ellipsizeMode='tail' // <--- Aplicado
                >
                  {formatName(me.name)} {/* <--- Nome formatado */}
                </Text>
                <Text style={styles.userLevel}>{mapLevel(me.points)}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{me.points} pts</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.rankingListContainer}>
          <Text style={styles.rankingListTitle}>Ranking Completo</Text>
          {rest.map((u) => (
            <View key={u.position} style={styles.rankingItem}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{u.position}</Text>
              </View>
              <Avatar name={u.name as string} size={36} style={styles.avatarThumb} />
              <View style={styles.userInfo}>
                <Text 
                  style={styles.userName}
                  numberOfLines={1} 
                  ellipsizeMode='tail' // <--- Aplicado
                >
                  {formatName(u.name)} {/* <--- Nome formatado */}
                </Text>
                <Text style={styles.userLevel}>{mapLevel(u.points)}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{u.points} pts</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.moreButtonContainer}>
          {isFetchingMore ? (
            <ActivityIndicator color="#4a7f37" />
          ) : leaderboard.length < total ? (
            <TouchableOpacity style={styles.moreButton} onPress={handleLoadMore}>
              <Text style={styles.moreButtonText}>Carregar mais</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ textAlign: 'center', color: '#666' }}>Fim do ranking</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1, backgroundColor: '#f8f9fa' },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    alignItems: 'center',
  },
  titleText: { fontSize: 28, fontWeight: 'bold', color: '#4a7f37', marginBottom: 8 },
  subtitleText: { fontSize: 16, color: '#4a7f37' },

  // ======== PÓDIO ========
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  podiumItem: { alignItems: 'center', flex: 1, paddingHorizontal: 5 }, // Ajustado padding para dar respiro
  positionLabel: {
    fontSize: 14,
    color: '#4a7f37',
    marginBottom: 6,
    fontWeight: '600',
  },
  podiumCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    elevation: 4,
  },
  firstPlace: { backgroundColor: '#FFD700' },
  secondPlace: { backgroundColor: '#C0C0C0' },
  thirdPlace: { backgroundColor: '#CD7F32' },
  initial: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  podiumName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#292a2b', 
    width: '100%', 
    maxWidth: 100, // Largura restrita para centralizar o texto
    textAlign: 'center', // <--- CORREÇÃO CRÍTICA AQUI
    marginBottom: 4, // Adicionado pequeno espaço
  },
  podiumPoints: { fontSize: 14, color: '#4a7f37', fontWeight: '600' },
  podiumLevel: { fontSize: 12, color: '#666' },

  // ======== LISTA ========
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
    color: '#4a7f37',
    marginBottom: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  positionContainer: { width: 40, alignItems: 'center' },
  positionText: { fontSize: 18, fontWeight: 'bold', color: '#4a7f37' },
  avatarThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  userInfo: { flex: 1 },
  userName: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#292a2b', 
    marginBottom: 4, 
    flexShrink: 1, 
  },
  userLevel: { fontSize: 12, color: '#666' },
  pointsContainer: { alignItems: 'flex-end' },
  pointsText: { fontSize: 16, fontWeight: 'bold', color: '#4a7f37' },
  moreButtonContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  moreButton: {
    backgroundColor: '#4a7f37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  moreButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});