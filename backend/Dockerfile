# Dockerfile para o backend Node.js
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]

