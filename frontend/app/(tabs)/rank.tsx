import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Header from '../../components/Header';
import { API_URL } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

type RankItem = { position: number; name: string; points: number; photoUrl?: string | null };

function mapLevel(points: number): string {
  // Thresholds ajustados: <100 Bronze; 200–399 Prata; 400–699 Ouro; 700+ Diamante
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
        const res = await fetch(`${API_URL}/leaderboard?limit=${pageSize}&skip=0`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Falha ao carregar ranking');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setMe(data.me || null);
        setTotal(data.total || 0);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar ranking');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore) return;
    if (leaderboard.length >= total) return;
    try {
      setIsFetchingMore(true);
      const res = await fetch(`${API_URL}/leaderboard?limit=${pageSize}&skip=${leaderboard.length}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Falha ao carregar mais');
      const data = await res.json();
      setLeaderboard((prev) => [...prev, ...(data.leaderboard || [])]);
      setTotal(data.total || total);
    } catch (e) {
      // silencioso
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
        {/* Header do ranking */}
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>🏆 Ranking de Pontos</Text>
          <Text style={styles.subtitleText}>Veja quem está liderando o ranking</Text>
        </View>

        {/* Top 3 Pódio */}
        {top3.length > 0 && (
          <View style={styles.podiumContainer}>
            {/* 2º Lugar */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumCircle, styles.secondPlace]}>
                <Text style={styles.podiumPosition}>{top3[1]?.position || 2}</Text>
              </View>
              {!!top3[1]?.photoUrl && (
                <Image source={{ uri: top3[1]?.photoUrl as string }} style={styles.avatarThumbLarge} />
              )}
              <Text style={styles.podiumName}>{top3[1]?.name || '-'}</Text>
              <Text style={styles.podiumPoints}>{top3[1]?.points?.toLocaleString() || 0} pts</Text>
              <Text style={styles.podiumLevel}>{mapLevel(top3[1]?.points || 0)}</Text>
            </View>

            {/* 1º Lugar */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumCircle, styles.firstPlace]}>
                <Text style={styles.podiumPosition}>{top3[0]?.position || 1}</Text>
              </View>
              {!!top3[0]?.photoUrl && (
                <Image source={{ uri: top3[0]?.photoUrl as string }} style={styles.avatarThumbLarge} />
              )}
              <Text style={styles.podiumName}>{top3[0]?.name || '-'}</Text>
              <Text style={styles.podiumPoints}>{top3[0]?.points?.toLocaleString() || 0} pts</Text>
              <Text style={styles.podiumLevel}>{mapLevel(top3[0]?.points || 0)}</Text>
            </View>

            {/* 3º Lugar */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumCircle, styles.thirdPlace]}>
                <Text style={styles.podiumPosition}>{top3[2]?.position || 3}</Text>
              </View>
              {!!top3[2]?.photoUrl && (
                <Image source={{ uri: top3[2]?.photoUrl as string }} style={styles.avatarThumbLarge} />
              )}
              <Text style={styles.podiumName}>{top3[2]?.name || '-'}</Text>
              <Text style={styles.podiumPoints}>{top3[2]?.points?.toLocaleString() || 0} pts</Text>
              <Text style={styles.podiumLevel}>{mapLevel(top3[2]?.points || 0)}</Text>
            </View>
          </View>
        )}

        {/* Lista completa do ranking */}
        <View style={styles.rankingListContainer}>
          <Text style={styles.rankingListTitle}>Ranking Completo</Text>
          {rest.map((u) => (
            <View key={u.position} style={styles.rankingItem}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{u.position}</Text>
              </View>
              {!!u.photoUrl && (
                <Image source={{ uri: u.photoUrl as string }} style={styles.avatarThumb} />
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userLevel}>{mapLevel(u.points)}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{u.points.toLocaleString()} pts</Text>
              </View>
            </View>
          ))}
        </View>

        {me && (
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ color: '#666', marginBottom: 8 }}>Sua posição</Text>
            <View style={styles.rankingItem}>
              <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{me.position}</Text>
              </View>
              {!!me.photoUrl && (
                <Image source={{ uri: me.photoUrl as string }} style={styles.avatarThumb} />
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{me.name}</Text>
                <Text style={styles.userLevel}>{mapLevel(me.points)}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{me.points.toLocaleString()} pts</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botão para ver mais */}
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
    color: '#4a7f37',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#4a7f37',
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
    color: '#4a7f37',
    fontWeight: '600',
    marginBottom: 2,
  },
  podiumLevel: {
    fontSize: 12,
    color: '#666',
  },
  avatarThumbLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
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
    color: '#4a7f37',
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
    color: '#4a7f37',
  },
  avatarThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    marginRight: 12,
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
    color: '#4a7f37',
  },
  moreButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moreButton: {
    backgroundColor: '#4a7f37',
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