import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from '../../components/AuthGuard';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Calcula o padding inferior considerando a área segura do dispositivo
  // Em dispositivos com botões de navegação do sistema, insets.bottom será maior que 0
  const bottomPadding = Math.max(insets.bottom, 5);
  const tabBarHeight = 60 + bottomPadding;
  
  return (
    <AuthGuard>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff', // Cor do ícone ativo
        tabBarInactiveTintColor: '#fff', // Cor do ícone inativo
        tabBarStyle: {
          backgroundColor: '#4a7f37',
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 5,
          borderTopWidth: 0,
          elevation: 10,
        },
        headerShown: false, // Oculta o cabeçalho padrão
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Missões',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Rank',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          href: null,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />

      {/* Mantém a rota Indicators, mas escondida da barra de tabs */}
      <Tabs.Screen
        name="Indicators"
        options={{
          title: 'Indicadores',
          href: null,
        }}
      />

      {/* Essas telas não aparecerão mais na barra de navegação.
          Use 'href: null' para escondê-las, mas mantê-las na estrutura de navegação.
      */}
      <Tabs.Screen
        name="ProfileCurriculumScreen"
        options={{
          title: 'ProfileCurriculum',
          href: null,
        }}
      />
      <Tabs.Screen
        name="descontos"
        options={{
          title: 'Descontos',
          href: null,
        }}
      />
      <Tabs.Screen
        name="extrato"
        options={{
          title: 'Extrato',
          href: null, 
        }}
      />
      <Tabs.Screen
        name="pontos"
        options={{
          title: 'Pontos',
          href: null, 
        }}
      />
      <Tabs.Screen
        name="cursos"
        options={{
          title: 'Cursos',
          href: null, 
        }}  

      />
      <Tabs.Screen
        name="emprestimos"
        options={{
          title: 'Emprestimos',
          href: null, 
        }}     
      />
      <Tabs.Screen
        name="editProfile"
        options={{
          title: 'Editar Perfil',
          href: null, 
        }}        

      />
 
 
    </Tabs>
    </AuthGuard>
  );
}
