// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar requisições JSON
app.use(express.json());

// String de conexão com o MongoDB.
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/app_beneficios';

// Conecta ao banco de dados MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro de conexão com o MongoDB:', err));

// Importa as rotas de autenticação
const authRoutes = require('./src/routes/auth');

// Adiciona as rotas de autenticação ao seu aplicativo
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de autenticação funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
