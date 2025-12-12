// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Aumenta o limite do body para suportar imagens base64 (até 50MB para garantir)
// Nota: Mesmo com limite alto, é recomendado comprimir imagens no frontend
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || '*',
  credentials: true,
}));

// Serve arquivos estáticos da pasta uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/app_beneficios';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro de conexão com o MongoDB:', err));

// Importa as rotas de autenticação, perfil e missões
const authRoutes = require('./src/routes/auth.js');
const profileRoutes = require('./src/routes/profile.js'); 
const missionsRoutes = require('./src/routes/missions.js'); // Importe a nova rota
const leaderboardRoutes = require('./src/routes/leaderboard.js');
const uploadRoutes = require('./src/routes/upload.js'); // Rota de upload

// Adiciona as rotas ao seu aplicativo
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/missions', missionsRoutes); // Adicione esta linha crucial aqui
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/upload', uploadRoutes); // Rota de upload de imagens

app.get('/', (req, res) => {
  res.send('Servidor de autenticação funcionando!');
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});