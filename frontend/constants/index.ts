// Objeto de configuração para URLs da API
export const API_CONFIG = {
  // A URL base da sua API sem o caminho de rota
  emulator: 'http://10.0.2.2:3000/api', 
  // Para testar em um celular na mesma rede local que o seu PC.
  // IMPORTANTE: Substitua '192.168.1.15' pelo IP do seu próprio computador.
  localNetwork: 'http://192.168.1.15:3000/api',
  // Para o seu backend hospedado no Vercel
  vercel: 'https://seu-backend-incrivel.vercel.app/api',
};

// A URL base que aponta para o seu backend.
// Mude para 'localNetwork' para testar no seu celular físico.
// Mude para 'vercel' para a versão de produção.

// export const API_URL = API_CONFIG.localNetwork;
export const API_URL = API_CONFIG.emulator;
