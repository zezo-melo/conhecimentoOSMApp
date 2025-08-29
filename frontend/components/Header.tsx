import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuPress?: () => void;
}

export default function Header({ onMenuPress }: HeaderProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [isPressed, setIsPressed] = useState(false);
  const { user, signOut } = useAuth();

  const handleMenuPress = () => {
    console.log('Botão do menu pressionado');
    if (onMenuPress) {
      console.log('Usando função personalizada onMenuPress');
      onMenuPress();
    } else {
      // Abre o drawer usando o navigation
      console.log('Tentando abrir drawer com navigation.openDrawer()');
      try {
        navigation.openDrawer();
        console.log('Drawer aberto com sucesso');
      } catch (error) {
        console.log('Erro ao abrir drawer:', error);
      }
    }
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

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <View style={styles.header}>

      <TouchableOpacity 
        style={[
          styles.menuButton,
          isPressed && styles.menuButtonPressed
        ]} 
        onPress={handleMenuPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons 
          name="menu" 
          size={24} 
          color={isPressed ? "#0d47a1" : "#1976D2"} 
        />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        {/* Caminho correto: ../assets/images/ */}
        <Image
          source={require('../assets/images/brb-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          onError={(error) => console.log('Erro ao carregar imagem:', error)}
          onLoad={() => console.log('Imagem carregada com sucesso!')}
        />
        
      </View>
      
      <View style={styles.rightSection}>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userLevel}>Nível {user.level}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out" size={20} color="#1976D2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 60,
    minHeight: 50,
  },
  menuButton: {
    padding: 12,
    zIndex: 5,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  menuButtonPressed: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.95 }],
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: '#fff', // Cor de fundo para debug
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 5,
  },
  placeholder: {
    width: 40,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
  },
}); 