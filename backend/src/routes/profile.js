// backend/src/routes/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { getProfile, updateProfile } = require('../controllers/authController');

// Nota: O limite de body é configurado no server.js principal
// Não precisamos configurar novamente aqui para evitar conflitos

// Rota GET para buscar o perfil do usuário logado
router.get('/', authMiddleware, getProfile);

// Rota PUT para atualizar o perfil do usuário
router.put('/', authMiddleware, updateProfile);

module.exports = router;