// src/routes/auth.js
// Define as rotas para o seu sistema de autenticação
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para cadastro de usuário
router.post('/register', authController.register);

// Rota para login de usuário
router.post('/login', authController.login);


module.exports = router;
