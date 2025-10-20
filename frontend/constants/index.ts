import { Platform } from 'react-native';

// Objeto de configuração para URLs da API
export const API_CONFIG = {
  // A URL base da sua API sem o caminho de rota
  emulator: 'http://10.0.2.2:3000/api', 
  // Para testar em um celular na mesma rede local que o seu PC.
  // IMPORTANTE: Substitua '172.17.1.103' pelo IP do seu próprio computador.
  localNetwork: 'http://192.168.1.27:3000/api',
  // Para o seu backend hospedado no Vercel
  vercel: 'https://seu-backend-incrivel.vercel.app/api',
  // Para usar com tunnel do Expo (funciona em qualquer rede)
  tunnel: 'https://seu-backend-incrivel.vercel.app/api',
};

// Configuração automática baseada na plataforma
const getApiUrl = () => {
  // Se estiver em desenvolvimento e for iOS, use tunnel para evitar problemas de rede
  if (__DEV__ && Platform.OS === 'ios') {
    return API_CONFIG.tunnel;
  }
  
  // Para dispositivos físicos, use localNetwork
  if (__DEV__) {
    return API_CONFIG.localNetwork;
  }
  
  // Para produção, use vercel
  return API_CONFIG.vercel;
};

// A URL base que aponta para o seu backend.
export const API_URL = getApiUrl();

// Configuração adicional para iOS
export const IOS_CONFIG = {
  // Timeout maior para iOS (mais lento em desenvolvimento)
  timeout: 30000,
  // Headers específicos para iOS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
