import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Simulação de AsyncStorage para o ambiente do Canvas
const asyncStorage = {
  data: {},
  getItem: async (key) => asyncStorage.data[key] || null,
  setItem: async (key, value) => { asyncStorage.data[key] = value; },
  removeItem: async (key) => { delete asyncStorage.data[key]; },
};

// Simulação de Alert para o ambiente do Canvas
const Alert = {
  alert: (title, message) => {
    console.log(`ALERTA: ${title}\n${message}`);
  }
};

// Objeto de configuração para URLs da API
const API_CONFIG = {
  // Para testar no emulador Android
  emulator: 'http://10.0.2.2:3000/api/auth', 
  // Para testar em um celular na mesma rede local que o seu PC
  localNetwork: 'http://192.168.1.15:3000/api/auth',
  // Para o seu backend hospedado no Vercel
  vercel: 'https://seu-backend-incrivel.vercel.app/api/auth',
};

// Altere esta variável para mudar a URL da API para o ambiente de teste
const API_URL = API_CONFIG.emulator; 

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
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
  updateUser: (userData: Partial<User>) => void;
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
        const mockUser: User = {
          id: '1',
          name: 'Usuário BRB',
          email: 'mock@user.com', 
          level: 4,
          xp: 1395,
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token } = response.data;
      
      await asyncStorage.setItem('@AppBeneficios:token', token);
      
      const mockUser: User = {
        id: '1',
        name: 'Usuário BRB',
        email: email,
        level: 4,
        xp: 1395,
      };

      setUser(mockUser);
      
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error('Falha na autenticação. Verifique seu email e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: UserRegistrationData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      Alert.alert('Sucesso', response.data.message);
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      throw new Error('Falha no cadastro. Verifique os dados ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await asyncStorage.removeItem('@AppBeneficios:token');
    } catch (error) {
      console.log('Erro no logout:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      console.warn("Função updateUser precisa ser implementada para salvar os dados no backend.");
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
