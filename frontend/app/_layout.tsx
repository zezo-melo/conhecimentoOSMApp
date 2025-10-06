// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerContent from '../components/DrawerContent';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Garante que a SplashScreen permaneça visível até a autenticação ser carregada
SplashScreen.preventAutoHideAsync();

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  // Se não estiver autenticado, exibe as telas de login/cadastro
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }

  // Se estiver autenticado, exibe o Drawer com as rotas internas
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        swipeMinDistance: 10,
        drawerPosition: 'left',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Missões',
        }}
      />
      <Drawer.Screen
        name="rank"
        options={{
          drawerLabel: 'Ranking',
        }}
      />
      <Drawer.Screen
        name="shop"
        options={{
          drawerLabel: 'Shop',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Perfil',
        }}
      />
      <Drawer.Screen
        name="descontos"
        options={{
          drawerLabel: 'Descontos',
        }}
      />
      <Drawer.Screen
        name="cursos"
        options={{
          drawerLabel: 'Cursos',
        }}
      />
      <Drawer.Screen
        name="pontos"
        options={{
          drawerLabel: 'Pontos',
        }}
      />
      <Drawer.Screen
        name="extrato"
        options={{
          drawerLabel: 'Extrato',
        }}
      />
      <Drawer.Screen
        name="editProfile"
        options={{
          drawerLabel: 'Editar Perfil',
        }}
      />
      <Drawer.Screen 
        name="quiz"
        options={{
          drawerLabel: 'Quiz',
        }}
      />
      
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
