import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { Stack } from 'expo-router';
import { router } from "expo-router";
import { formatName } from "../../utils/formatName";
import { API_URL } from '../../constants';


const MENU_OPTIONS = [
  { 
    id: '1', 
    title: 'Editar Perfil', 
    icon: '👤', 
    route: '/editProfile', 
    onPress: () => router.push('/editProfile') 
  },
  { 
    id: '2', 
    title: 'Indicadores', 
    icon: '📊', 
    route: '/comissoes', 
    onPress: () => router.push('/comissoes') 
  },
  { id: '3', title: 'Configurações', icon: '⚙️', action: 'settings' },
  { id: '4', title: 'Notificações', icon: '🔔', action: 'notifications' },
  { id: '5', title: 'Privacidade', icon: '🔒', action: 'privacy' },
  { id: '6', title: 'Ajuda e Suporte', icon: '❓', action: 'help' },
  { id: '7', title: 'Sobre o App', icon: 'ℹ️', action: 'about' },
];


export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@AppBeneficios:token');
      console.log("TOKEN RECUPERADO:", token);
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0e76e0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header do perfil */}
        <View style={styles.headerSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            { (profile?.photoUrl || user?.photoUrl) ? (
              <Image source={{ uri: (profile?.photoUrl || user?.photoUrl) as string }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{formatName(user?.name?.charAt(0)) || '?'}</Text>
              </View>
            ) }
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{user?.level || 'N/A'}</Text>
            </View>
          </View>
          
          {/* Informações do usuário */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{formatName(user?.name) || 'Carregando...'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(user?.missions as any) || user?.missionsCompleted?.length || 0}</Text>
            <Text style={styles.statLabel}>Missões</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.level || 'N/A'}</Text>
            <Text style={styles.statLabel}>Ranking</Text>
          </View>
        </View>

        {/* Menu de opções */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Configurações</Text>
          
          {MENU_OPTIONS.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.menuItem} 
              onPress={option.onPress}  // <- adiciona isso
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{option.icon}</Text>
                <Text style={styles.menuText}>{option.title}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4a7f37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#292a2b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a7f37',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
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
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#292a2b',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#4a7f37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
