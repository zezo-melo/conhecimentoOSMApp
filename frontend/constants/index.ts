import { Platform } from 'react-native';

// Objeto de configuração para URLs da API
export const API_CONFIG = {
  // A URL base da sua API sem o caminho de rota
  // ESTE ENDEREÇO É EXCLUSIVO PARA O EMULADOR ANDROID ACESSAR SEU COMPUTADOR LOCAL
  emulator: 'http://10.0.2.2:3000/api', 
  // Para testar em um celular na mesma rede local que o seu PC.
  // IMPORTANTE: Substitua '172.17.1.103' pelo IP do seu próprio computador.
  localNetwork: 'https://api-conhecimentos.mentorh.com/api',
  // Para o seu backend hospedado no Vercel
  // Aqui apontamos para a API em produção já com o prefixo /api,
  // pois o seu backend monta as rotas como /api/auth, /api/profile, etc.
  vercel: 'https://api-conhecimentos.mentorh.com/api',
  // Para usar com tunnel do Expo (funciona em qualquer rede)
  tunnel: 'https://api-conhecimentos.mentorh.com/api',
  // NOVO: Configuração para o servidor da empresa (acesso via VPN )
  // O IP 172.170.10.1 é o IP do servidor host.
  // A porta 8106 é a porta mapeada pelo Docker (8106:3000).
  server: 'http://172.170.10.1:8106/api',
};

// Configuração automática baseada na plataforma
const getApiUrl = ( ) => {
  // 1) Permite override via variável de ambiente do Expo (app.config, eas, etc)
  // @ts-ignore - process.env pode não estar tipado aqui
  const envUrl = process?.env?.EXPO_PUBLIC_API_URL || process?.env?.API_URL;
  if (envUrl && typeof envUrl === 'string') {
    return envUrl;
  }

// >>>>>> LÓGICA ATUALIZADA AQUI <<<<<<
// Mesmo em desenvolvimento, vamos priorizar a API pública estável.
// Se quiser voltar ao backend local, defina EXPO_PUBLIC_API_URL ou altere manualmente abaixo.
if (__DEV__) {
  return API_CONFIG.vercel; // evita 10.0.2.2 quando o backend local não está rodando
}
// >>>>>> FIM DA LÓGICA ATUALIZADA <<<<<<

// Para produção, usa a mesma URL pública
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

// URL pública do backend BFF de indicadores (pode ser sobrescrita por variável de ambiente)
export const INDICATORS_BFF_URL = (process?.env?.EXPO_PUBLIC_INDICATORS_URL as string) || 'https://bff-indicadores.onrender.com';