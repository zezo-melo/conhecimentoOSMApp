# Solução para Problemas de Conectividade - Expo Go em Dispositivos Físicos

## Problema
O app funciona no emulador Android pelo PC, mas no Expo Go pelo celular físico dá erro de "Network Error".

## Soluções Implementadas

### 1. Configuração do Backend ✅
- O servidor está configurado para aceitar conexões externas (`HOST = '0.0.0.0'`)
- CORS configurado para aceitar todas as origens
- Regra de firewall criada para permitir conexões na porta 3000

### 2. Configuração do Frontend ✅
- IP local configurado corretamente: `192.168.1.15:3000`
- API_URL configurada para usar `localNetwork` para dispositivos físicos

### 3. Script de Desenvolvimento ✅
- Criado `start-dev.bat` para iniciar backend e frontend automaticamente

## Como Usar

### Opção 1: Usando o Script Automático
```bash
# Execute o arquivo start-dev.bat
start-dev.bat
```

### Opção 2: Manual
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend (aguarde o backend inicializar)
cd frontend
npx expo start --clear --tunnel
```

## Verificações Importantes

### 1. Mesma Rede WiFi
- Certifique-se de que o PC e o celular estão na mesma rede WiFi
- Verifique o IP do PC: `ipconfig` (deve ser 192.168.1.15)

### 2. Firewall
- Regra de firewall criada automaticamente
- Se ainda houver problemas, desative temporariamente o firewall do Windows

### 3. Teste de Conectividade
```bash
# Teste se o backend está acessível
curl http://192.168.1.15:3000
```

## Configurações por Ambiente

No arquivo `frontend/constants/index.ts`:

- **Emulador**: `API_CONFIG.emulator` (10.0.2.2:3000)
- **Dispositivo Físico**: `API_CONFIG.localNetwork` (192.168.1.15:3000)
- **Produção**: `API_CONFIG.vercel`

## Troubleshooting

### Se ainda não funcionar:

1. **Verifique o IP atual do PC:**
   ```bash
   ipconfig
   ```

2. **Atualize o IP no arquivo constants/index.ts:**
   ```typescript
   localNetwork: 'http://SEU_IP_ATUAL:3000/api'
   ```

3. **Use o modo tunnel do Expo:**
   ```bash
   npx expo start --tunnel
   ```

4. **Desative temporariamente o antivírus/firewall**

5. **Reinicie o roteador WiFi**

## Status Atual
- ✅ Backend configurado para aceitar conexões externas
- ✅ Frontend configurado com IP correto
- ✅ Regra de firewall criada
- ✅ Script de desenvolvimento criado
- ✅ Teste de conectividade realizado com sucesso
