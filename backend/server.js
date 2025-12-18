// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// const curriculumRoutes = require('./src/controllers/CurriculumController.js'); // REMOVIDO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || '*',
  credentials: true,
}));

// Serve arquivos enviados (avatars, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/app_beneficios';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro de conexão com o MongoDB:', err));

// Importa as rotas de autenticação, perfil e missões
const authRoutes = require('./src/routes/auth.js');
const profileRoutes = require('./src/routes/profile.js'); 
const missionsRoutes = require('./src/routes/missions.js'); 
const leaderboardRoutes = require('./src/routes/leaderboard.js');
// NOVO: Importação CORRETA do arquivo de rotas (routes)
const curriculumRoutes = require('./src/routes/curriculumRoutes.js'); 

// Adiciona as rotas ao seu aplicativo
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
// NOVO: Mapeamento da rota do currículo: O endpoint final será /api/users/curriculum/me
app.use('/api/users', curriculumRoutes); 

app.get('/', (req, res) => {
  res.send('Servidor de autenticação funcionando!');
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});