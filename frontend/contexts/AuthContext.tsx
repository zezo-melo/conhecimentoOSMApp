import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import { API_URL, IOS_CONFIG } from '../constants';

// --- SIMULAÇÃO REMOVIDA AQUI ---

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  points: number;
  missions?: number;
  missionsCompleted?: string[];
  // Campos usados nas telas
  completedMissions?: number;
  rank?: string | number;

  // NOVO CAMPO DA MISSÃO (Root do User, conforme User.js)
  profileMissionCompleted: boolean;

  // CAMPOS DE PERFIL (Root do User, conforme User.js)
  dob: string;
  docType: string;
  document: string;
  phone: string;
  bio?: string;
  photoUrl?: string;

  // CAMPO DE ENDEREÇO (Sub-documento no User.js)
  address?: {
    street?: string;
    city?: string;
    state?: string;
    // Se seu User.js tiver zipCode, adicione aqui
  };

  // CAMPOS DE BAÚS E MISSÕES
  chestsOpened?: string[];
}

interface UserRegistrationData {
  name: string;
  email: string;
  dob: Date;
  docType: string;
  document: string;
  phone: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: UserRegistrationData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configurar axios para iOS
  useEffect(() => {
    console.log('⚙️ [AuthContext] Configurando axios para plataforma:', Platform.OS);
    
    if (Platform.OS === 'ios') {
      console.log('🍎 [AuthContext] Configurando para iOS...');
      axios.defaults.timeout = IOS_CONFIG.timeout;
      axios.defaults.headers.common = {
        ...axios.defaults.headers.common,
        ...IOS_CONFIG.headers
      };
      console.log('✅ [AuthContext] Configuração iOS aplicada');
    }
    
    // Testar AsyncStorage no iOS
    if (Platform.OS === 'ios') {
      testAsyncStorage();
    }
  }, []);

  const testAsyncStorage = async () => {
    try {
      console.log('🧪 [AuthContext] Testando AsyncStorage no iOS...');
      await AsyncStorage.setItem('@AppBeneficios:test', 'test-value');
      const testValue = await AsyncStorage.getItem('@AppBeneficios:test');
      console.log('✅ [AuthContext] AsyncStorage funcionando:', testValue === 'test-value' ? 'SIM' : 'NÃO');
      await AsyncStorage.removeItem('@AppBeneficios:test');
    } catch (error) {
      console.log('❌ [AuthContext] Erro no AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      console.log('🔍 [AuthContext] Iniciando carregamento do usuário...');
      
      // Usando o AsyncStorage real importado
      const storedToken = await AsyncStorage.getItem('@AppBeneficios:token'); 
      console.log('🔑 [AuthContext] Token encontrado:', storedToken ? 'SIM' : 'NÃO');
      
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Configuração específica para iOS
        const config = Platform.OS === 'ios' ? {
          timeout: IOS_CONFIG.timeout,
          headers: IOS_CONFIG.headers
        } : {};
        
        console.log('🌐 [AuthContext] Fazendo requisição para:', `${API_URL}/profile`);
        console.log('📱 [AuthContext] Plataforma:', Platform.OS);
        
        const response = await axios.get(`${API_URL}/profile`, config);
        console.log('✅ [AuthContext] Usuário carregado com sucesso:', response.data?.name || 'Sem nome');
        setUser(response.data);
      } else {
        console.log('❌ [AuthContext] Nenhum token encontrado, usuário não autenticado');
        setUser(null);
      }
    } catch (error: any) {
      console.log('❌ [AuthContext] Erro ao carregar usuário:', (error as any).response?.data || (error as any).message);
      console.log('🔍 [AuthContext] Detalhes do erro:', {
        code: error.code,
        message: error.message,
        response: error.response?.status,
        platform: Platform.OS
      });
      
      // Se for erro de rede no iOS, limpar token e tentar novamente
      if (Platform.OS === 'ios' && (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error'))) {
        console.log('🧹 [AuthContext] Erro de rede no iOS, limpando token...');
        await AsyncStorage.removeItem('@AppBeneficios:token');
        delete axios.defaults.headers.common['Authorization'];
      }
      
      setUser(null);
    } finally {
      console.log('🏁 [AuthContext] Finalizando carregamento, isLoading = false');
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      setUser(response.data);
    } catch (error) {
      console.log('Erro ao atualizar perfil do usuário:', (error as any).response?.data || (error as any).message);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      setUser(response.data);
    } catch (error) {
      console.log('Erro ao atualizar dados do usuário:', (error as any).response?.data || (error as any).message);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 [AuthContext] Iniciando login...');
    setIsLoading(true);
    try {
      console.log('📧 [AuthContext] Email:', email);
      console.log('🌐 [AuthContext] URL de login:', `${API_URL}/auth/login`);
      console.log('📱 [AuthContext] Plataforma:', Platform.OS);
      
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('✅ [AuthContext] Login bem-sucedido, token recebido');
      
      const { token } = response.data;
      
      // Usando o AsyncStorage real importado
      console.log('💾 [AuthContext] Salvando token no AsyncStorage...');
      await AsyncStorage.setItem('@AppBeneficios:token', token); 
      
      // Verificar se o token foi salvo
      const savedToken = await AsyncStorage.getItem('@AppBeneficios:token');
      console.log('🔍 [AuthContext] Token salvo com sucesso:', savedToken ? 'SIM' : 'NÃO');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('👤 [AuthContext] Buscando perfil do usuário...');
      const profileResponse = await axios.get(`${API_URL}/profile`);
      console.log('✅ [AuthContext] Perfil carregado:', profileResponse.data?.name || 'Sem nome');
      
      setUser(profileResponse.data);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no login:', error.response?.data || error.message);
      console.log('🔍 [AuthContext] Detalhes do erro de login:', {
        code: error.code,
        message: error.message,
        response: error.response?.status,
        platform: Platform.OS
      });
      throw new Error('Falha na autenticação. Verifique seu email e senha.');
    } finally {
      console.log('🏁 [AuthContext] Finalizando login, isLoading = false');
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      // Usando o AsyncStorage real importado
      await AsyncStorage.removeItem('@AppBeneficios:token'); 
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.log('Erro no logout:', error);
    }
  };

  const signUp = async (data: UserRegistrationData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      Alert.alert('Sucesso', response.data.message);
    } catch (error: any) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      throw new Error('Falha no cadastro. Verifique os dados ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    setIsLoading(true);
    try {
      console.log('📤 [AuthContext] Enviando atualização de perfil...');
      
      // Calcula tamanho do payload se tiver photoUrl
      if (profileData.photoUrl) {
        const sizeInBytes = (profileData.photoUrl.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        console.log('📸 [AuthContext] PhotoUrl presente. Tamanho:', sizeInMB.toFixed(2), 'MB');
      } else {
        console.log('📸 [AuthContext] PhotoUrl não presente');
      }
      
      // Configura axios com limite maior para esta requisição específica
      const response = await axios.put(`${API_URL}/profile`, profileData, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000, // 60 segundos de timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const updatedUser = response.data;
      
      console.log('✅ [AuthContext] Perfil atualizado com sucesso');
      console.log('📸 [AuthContext] PhotoUrl recebida:', updatedUser.photoUrl ? `Sim (${updatedUser.photoUrl.substring(0, 50)}...)` : 'Não');
      
      setUser(updatedUser);
    } catch (error) {
      const err = error as any;
      console.error('❌ [AuthContext] Erro ao atualizar perfil:', err.response?.data || err.message);
      console.error('❌ [AuthContext] Status:', err.response?.status);
      console.error('❌ [AuthContext] Dados do erro:', err.response?.data);
      
      // Tratamento específico para erro 413
      if (err.response?.status === 413) {
        const errorMessage = 'A imagem é muito grande. Por favor, selecione uma imagem menor ou tente novamente.';
        throw new Error(errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};