const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uploadController = require('../controllers/uploadController');

// Rota POST para fazer upload de imagem (requer autenticação)
router.post('/', authMiddleware, uploadController.uploadMiddleware, uploadController.uploadImage);

// Rota DELETE para deletar imagem (opcional)
router.delete('/:filename', authMiddleware, uploadController.deleteImage);

module.exports = router;

