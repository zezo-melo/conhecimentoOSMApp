import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../constants'; // Importa a URL do novo ficheiro

// Simulação de AsyncStorage para o ambiente do Canvas
const asyncStorage = {
  data: {},
  getItem: async (key: string) => asyncStorage.data[key] || null, // Adicionado tipo 'key'
  setItem: async (key: string, value: any) => { asyncStorage.data[key] = value; }, // Adicionado tipos
  removeItem: async (key: string) => { delete asyncStorage.data[key]; }, // Adicionado tipo 'key'
};

// Simulação de Alert para o ambiente do Canvas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CanvasAlert = {
  alert: (title: string, message: string) => { // Adicionado tipos
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
  missions?: number;
  missionsCompleted?: string[];
  
  // NOVO CAMPO DA MISSÃO (Root do User, conforme User.js)
  profileMissionCompleted: boolean; 

  // CAMPOS DE PERFIL (Root do User, conforme User.js)
  dob: string;
  docType: string;
  document: string;
  phone: string; 
  bio?: string;
  
  // CAMPO DE ENDEREÇO (Sub-documento no User.js)
  address?: {
    street?: string;
    city?: string;
    state?: string;
    // Se seu User.js tiver zipCode, adicione aqui
  };

  // O OBJETO 'profile' aninhado foi REMOVIDO para eliminar a tipagem conflitante
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
  // CORRIGIDO: Agora aceita Partial<User> (campos planos)
  updateProfile: (data: Partial<User>) => Promise<void>; 
  // completeMission removido do tipo
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
      console.log('Erro ao carregar usuário:', (error as any).response?.data || (error as any).message);
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

  // CORRIGIDO: Agora espera Partial<User> (campos planos)
  const updateProfile = async (profileData: Partial<User>) => { 
    setIsLoading(true);
    try {
      // O profileData agora contém campos planos (phone, bio, etc.) e o backend espera isso.
      const response = await axios.put(`${API_URL}/profile`, profileData); 
      const updatedUser = response.data;
      setUser(updatedUser);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      const err = error as any;
      console.error('Erro ao atualizar perfil:', err.response?.data || err.message);
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao atualizar o perfil. Tente novamente.');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};