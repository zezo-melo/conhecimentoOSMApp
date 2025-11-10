# 🚀 Guia de Deploy - App Benefícios

Este guia explica como fazer o deploy do backend em Docker e gerar os builds do frontend (APK e IPA) para distribuição interna.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy do Backend (Docker)](#deploy-do-backend-docker)
3. [Build do Frontend (APK/IPA)](#build-do-frontend-apkipa)
4. [Página de Download](#página-de-download)
5. [Configuração de Produção](#configuração-de-produção)

---

## 📦 Pré-requisitos

### Para o Backend:
- Docker e Docker Compose instalados no servidor
- MongoDB (pode ser local, remoto ou em container)
- Acesso SSH ao servidor da empresa

### Para o Frontend:
- Node.js 18+ instalado
- Expo CLI instalado globalmente: `npm install -g expo-cli eas-cli`
- Conta Expo (gratuita): https://expo.dev
- Para iOS: Mac com Xcode (para builds locais) ou usar EAS Build (recomendado)

---

## 🐳 Deploy do Backend (Docker)

### 1. Preparar o ambiente no servidor

```bash
# No servidor, clone ou faça upload do código
cd /caminho/do/projeto/backend

# Crie o arquivo .env baseado no exemplo abaixo
nano .env
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` no diretório `backend/` com o seguinte conteúdo:

```env
# Configurações do Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# MongoDB - URL do seu banco de dados
MONGO_URI=mongodb://usuario:senha@host:porta/database
# OU para MongoDB local:
# MONGO_URI=mongodb://localhost:27017/app_beneficios

# JWT Secret - Gere uma string aleatória segura
# Execute: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=sua_chave_secreta_jwt_aqui

# CORS - URLs permitidas (separadas por vírgula)
# Coloque o domínio do servidor onde o backend estará rodando
CORS_ORIGIN=https://seu-servidor.com,http://seu-servidor.com
```

### 3. Construir e iniciar o container

```bash
# Opção 1: Usando docker-compose (recomendado)
docker-compose up -d --build

# Opção 2: Usando Docker diretamente
docker build -t app-beneficios-backend .
docker run -d \
  --name app-beneficios-backend \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  app-beneficios-backend
```

### 4. Verificar se está rodando

```bash
# Ver logs
docker logs app-beneficios-backend

# Verificar se está respondendo
curl http://localhost:3000
```

### 5. Configurar proxy reverso (Nginx - opcional)

Se você quiser usar HTTPS e um domínio, configure o Nginx:

```nginx
server {
    listen 80;
    server_name seu-servidor.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 Build do Frontend (APK/IPA)

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configurar o projeto

```bash
cd frontend
eas build:configure
```

### 3. Atualizar eas.json com a URL do backend

Edite o arquivo `frontend/eas.json` e atualize a URL da API:

```json
{
  "build": {
    "production-internal": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://seu-servidor.com/api"
      }
    }
  }
}
```

**IMPORTANTE:** Substitua `https://seu-servidor.com/api` pela URL real do seu backend.

### 4. Build para Android (APK)

```bash
cd frontend
eas build --platform android --profile production-internal
```

O build será feito na nuvem do Expo. Quando terminar, você receberá um link para download do APK.

### 5. Build para iOS (IPA)

```bash
cd frontend
eas build --platform ios --profile production-internal
```

**Nota:** Para iOS, você precisará:
- Conta Apple Developer (paga)
- Certificados de desenvolvimento configurados
- Ou usar TestFlight para distribuição interna

### 6. Builds locais (alternativa)

Se preferir builds locais:

```bash
# Android
eas build --platform android --profile production-internal --local

# iOS (apenas no Mac)
eas build --platform ios --profile production-internal --local
```

---

## 🌐 Página de Download

### 1. Configurar a página

1. Faça upload dos arquivos da pasta `download-page/` para o servidor
2. Coloque os arquivos APK e IPA na mesma pasta
3. Renomeie os arquivos para:
   - `app-beneficios.apk` (Android)
   - `app-beneficios.ipa` (iOS)

### 2. Servir a página

Você pode servir a página de várias formas:

**Opção A: Nginx**
```nginx
server {
    listen 80;
    server_name download.seu-servidor.com;
    root /caminho/para/download-page;
    index index.html;
}
```

**Opção B: Servidor simples Node.js**
```bash
cd download-page
npx http-server -p 8080
```

**Opção C: Servir via backend Express**
Adicione uma rota no `backend/server.js`:
```javascript
app.use('/download', express.static('download-page'));
```

### 3. Acessar a página

Acesse: `http://seu-servidor.com/download` ou `http://download.seu-servidor.com`

---

## ⚙️ Configuração de Produção

### Backend

1. **Segurança:**
   - Use HTTPS (certificado SSL)
   - Configure firewall para permitir apenas portas necessárias
   - Use variáveis de ambiente seguras
   - Não commite o arquivo `.env`

2. **MongoDB:**
   - Use MongoDB Atlas (cloud) ou configure MongoDB no servidor
   - Configure backups automáticos
   - Use autenticação no MongoDB

3. **Monitoramento:**
   - Configure logs do Docker
   - Use ferramentas como PM2 ou similar para monitoramento
   - Configure alertas

### Frontend

1. **URL da API:**
   - Certifique-se de que `EXPO_PUBLIC_API_URL` está configurada corretamente
   - Use HTTPS em produção
   - Configure CORS no backend para permitir apenas domínios específicos

2. **Builds:**
   - Use o perfil `production-internal` para distribuição interna
   - Use o perfil `production` para publicar nas lojas
   - Mantenha versões organizadas

3. **iOS:**
   - Configure App Store Connect para distribuição
   - Ou use TestFlight para distribuição interna
   - Para instalação direta via IPA, usuários precisarão de ferramentas especiais

---

## 🔧 Comandos Úteis

### Backend

```bash
# Ver logs do container
docker logs -f app-beneficios-backend

# Reiniciar container
docker restart app-beneficios-backend

# Parar container
docker stop app-beneficios-backend

# Remover container
docker rm app-beneficios-backend

# Ver status
docker ps
```

### Frontend

```bash
# Ver builds em andamento
eas build:list

# Ver detalhes de um build
eas build:view [BUILD_ID]

# Cancelar build
eas build:cancel [BUILD_ID]
```

---

## 📝 Checklist de Deploy

- [ ] Backend configurado com variáveis de ambiente
- [ ] MongoDB configurado e acessível
- [ ] Container Docker rodando e testado
- [ ] Backend acessível via URL pública
- [ ] CORS configurado corretamente
- [ ] Frontend configurado com URL do backend de produção
- [ ] Build Android (APK) gerado
- [ ] Build iOS (IPA) gerado (se aplicável)
- [ ] Página de download configurada
- [ ] Arquivos APK/IPA disponíveis na página
- [ ] Testes realizados em dispositivos reais
- [ ] HTTPS configurado (recomendado)

---

## 🆘 Troubleshooting

### Backend não conecta ao MongoDB
- Verifique a URL do MongoDB no `.env`
- Verifique se o MongoDB está acessível do container
- Teste a conexão: `docker exec -it app-beneficios-backend node -e "require('mongoose').connect('MONGO_URI').then(() => console.log('OK'))"`

### Frontend não conecta ao backend
- Verifique se `EXPO_PUBLIC_API_URL` está configurada
- Verifique CORS no backend
- Teste a URL do backend diretamente no navegador
- Verifique logs do backend

### Build do Expo falha
- Verifique se está logado: `eas whoami`
- Verifique configuração do `eas.json`
- Verifique se tem créditos no Expo (builds na nuvem consomem créditos)
- Para iOS, verifique certificados e perfis de provisionamento

---

## 📞 Suporte

Para mais informações:
- [Documentação do Expo](https://docs.expo.dev)
- [Documentação do Docker](https://docs.docker.com)
- [Documentação do EAS Build](https://docs.expo.dev/build/introduction/)

---

**Última atualização:** 2024

