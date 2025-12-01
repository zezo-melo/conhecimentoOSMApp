// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança básica de headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(express.json());

// CORS configurável por ambiente
const allowedOrigins =
  process.env.CORS_ORIGIN?.split(',')
    .map((o) => o.trim())
    .filter(Boolean) || ['*'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Rate limiting básico para toda a API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de requisições por IP na janela
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

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