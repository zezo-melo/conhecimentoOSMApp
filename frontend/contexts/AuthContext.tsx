import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../constants'; // Importa a URL do novo ficheiro

// Simulação de AsyncStorage para o ambiente do Canvas
const asyncStorage = {
  data: {},
  getItem: async (key) => asyncStorage.data[key] || null,
  setItem: async (key, value) => { asyncStorage.data[key] = value; },
  removeItem: async (key) => { delete asyncStorage.data[key]; },
};

// Simulação de Alert para o ambiente do Canvas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CanvasAlert = {
  alert: (title, message) => {
    console.log(`ALERTA: ${title}\n${message}`);
  }
};

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  points: number;
  missions: number;
  profile?: { 
    name: string;
    dob: string;
    docType: string;
    document: string;
    phone: string;
  };
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
  updateProfile: (data: Partial<User['profile']>) => Promise<void>;
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

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedToken = await asyncStorage.getItem('@AppBeneficios:token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await axios.get(`${API_URL}/profile`);
        setUser(response.data);
      }
    } catch (error: any) {
      console.log('Erro ao carregar usuário:', error.response?.data || error.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;
      await asyncStorage.setItem('@AppBeneficios:token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const profileResponse = await axios.get(`${API_URL}/profile`);
      setUser(profileResponse.data);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error('Falha na autenticação. Verifique seu email e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await asyncStorage.removeItem('@AppBeneficios:token');
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

  const updateProfile = async (profileData: Partial<User['profile']>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_URL}/profile`, profileData);
      const updatedUser = response.data;
      setUser(updatedUser);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao atualizar o perfil. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMission = async (missionId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/missions/complete-first-mission`, { missionId });
      setUser(response.data.user);
      Alert.alert('Sucesso', response.data.message);
      return true;
    } catch (error) {
      console.error('Erro ao completar missão:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao completar a missão.');
      return false;
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
        completeMission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
