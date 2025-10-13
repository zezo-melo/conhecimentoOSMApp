// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || '*',
  credentials: true,
}));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/app_beneficios';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro de conexão com o MongoDB:', err));

// Importa as rotas de autenticação, perfil e missões
const authRoutes = require('./src/routes/auth.js');
const profileRoutes = require('./src/routes/profile.js'); 
const missionsRoutes = require('./src/routes/missions.js'); // Importe a nova rota
const leaderboardRoutes = require('./src/routes/leaderboard.js');

// Adiciona as rotas ao seu aplicativo
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/missions', missionsRoutes); // Adicione esta linha crucial aqui
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de autenticação funcionando!');
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});