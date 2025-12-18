import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INDICATORS_BFF_URL } from '../constants';
import Header from '../components/Header';

// Tela que tenta descobrir endpoints do BFF e exibir o JSON retornado
export default function IndicatorsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const tryEndpoints = async () => {
      setLoading(true);
      setError(null);

      const candidates = [
        '/indicators',
        '/indicadores',
        '/users/curriculum/me',
        '/users/indicators/me',
        '/profile',
        '/users/profile',
        '/curriculum/me',
        '/curriculum',
        '/metrics',
        '/',
      ];

      // 1) Try without auth
      for (const p of candidates) {
        try {
          const url = INDICATORS_BFF_URL.replace(/\/$/, '') + p;
          const res = await axios.get(url, { timeout: 5000 });
          if (res.status >= 200 && res.status < 300) {
            setEndpoint(url);
            setData(res.data);
            setLoading(false);
            setError(null);
            return;
          }
        } catch (err: any) {
          // ignora e tenta próximo
        }
      }

      // 2) If none responded, try with token from AsyncStorage
      try {
        const token = await AsyncStorage.getItem('@AppBenefios:token');
        if (token) {
          for (const p of candidates) {
            try {
              const url = INDICATORS_BFF_URL.replace(/\/$/, '') + p;
              const res = await axios.get(url, { timeout: 5000, headers: { Authorization: `Bearer ${token}` } });
              if (res.status >= 200 && res.status < 300) {
                setEndpoint(url + ' (auth)');
                setData(res.data);
                setLoading(false);
                setError(null);
                return;
              }
            } catch (err: any) {
              // ignora e tenta próximo
            }
          }
        }
      } catch (e) {
        // falha ao ler token — segue
      }

      setError('Nenhum endpoint conhecido respondeu (nem público nem autenticado). Peça ao Felipe a lista de rotas (Swagger/OpenAPI) ou acesso ao repo do BFF.');
      setLoading(false);
    };

    tryEndpoints();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4a7f37" />
        <Text style={{ marginTop: 10 }}>Buscando endpoints no BFF...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Header />
      <Text style={styles.title}>Meus Indicadores</Text>

      {endpoint ? (
        <>
          <Text style={styles.subtitle}>Endpoint descoberto:</Text>
          <Text style={styles.endpoint}>{endpoint}</Text>
          <Text style={styles.subtitle}>Resposta (JSON):</Text>
          <Text style={styles.json}>{JSON.stringify(data, null, 2)}</Text>
        </>
      ) : (
        <View>
          <Text style={{ color: '#c00' }}>{error}</Text>
          <Text style={{ marginTop: 8 }}>Sugestão: peça ao Felipe o OpenAPI/Swagger ou a lista de rotas e exemplos de resposta. Se o BFF requer autenticação, será preciso um token.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12 },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 8 },
  endpoint: { color: '#555', marginTop: 4, marginBottom: 8 },
  json: { fontFamily: 'monospace', marginTop: 8, color: '#222' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
