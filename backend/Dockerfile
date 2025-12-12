# Usa uma imagem Node.js base (ajuste a versão se necessário)
FROM node:22.21.0-alpine

# Define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia e instala as dependências
# Usa esta etapa separada para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Cria a pasta uploads para armazenar imagens
RUN mkdir -p uploads

# Expõe a porta que seu servidor Express utiliza (você mencionou 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
# Certifique-se de que 'server.js' é o arquivo de inicialização correto
CMD [ "node", "server.js" ]