import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importa o useRouter para navegação
import React from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface DrawerContentProps {
  navigation: any;
  state: any;
  descriptors: any;
}

export default function DrawerContent({ navigation, state, descriptors }: DrawerContentProps) {
  const { user, signOut } = useAuth();
  const router = useRouter(); // Inicializa o hook de roteamento

  const menuItems = [
    // Atualizei as rotas para incluir a pasta `(tabs)`
    { icon: 'home', title: 'Missões', screen: '(tabs)' },
    { icon: 'trophy', title: 'Ranking', screen: '(tabs)/rank' },
    { icon: 'cart', title: 'Shop', screen: '(tabs)/shop' },
    { icon: 'person', title: 'Perfil', screen: '(tabs)/profile' },
    { icon: 'settings', title: 'Configurações', screen: 'settings' },
    { icon: 'help-circle', title: 'Ajuda', screen: 'help' },
    { icon: 'information-circle', title: 'Sobre', screen: 'about' },
  ];

  const handleNavigation = (screen: string) => {
    // Usando router.push para navegação, que funciona melhor com Expo Router
    router.push(screen as never);
    // Fechar o drawer após a navegação
    navigation.closeDrawer();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header do drawer */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImage}
            source={require('../assets/images/brb-logo.png')}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>App Benefícios</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userLevel}>Nível {user.level} • {user.xp} XP</Text>
          </View>
        )}
      </View>

      {/* Lista de opções */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.screen)}
          >
            <Ionicons name={item.icon as any} size={24} color="#1976D2" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#f44336" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-start',
  },
  logoContainer: {
    paddingTop: 30,
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: -10,
  },
  logoImage: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  userInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 5
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 8,
    paddingBottom: 10,
    backgroundColor: '#fff5f5',
    marginLeft: 0,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
