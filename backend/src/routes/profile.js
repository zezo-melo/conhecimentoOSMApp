// backend/src/routes/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { getProfile, updateProfile } = require('../controllers/authController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configura multer para salvar avatares
const avatarsDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, avatarsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname) || '.jpg';
		const filename = `${req.user?.id || 'anon'}-${Date.now()}${ext}`;
		cb(null, filename);
	}
});

const upload = multer({ storage });

// Rota GET para buscar o perfil do usuário logado
router.get('/', authMiddleware, getProfile);

// Rota PUT para atualizar o perfil do usuário
router.put('/', authMiddleware, updateProfile);

// Rota para upload de foto de perfil
router.post('/photo', authMiddleware, upload.single('photo'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

		// Monta URL pública para o arquivo salvo
		const publicUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

		// Atualiza o campo photoUrl do usuário
		const updated = await User.findByIdAndUpdate(req.user.id, { photoUrl: publicUrl }, { new: true }).select('-password');

		return res.json({ photoUrl: publicUrl, user: updated });
	} catch (err) {
		console.error('Erro ao salvar avatar:', err);
		return res.status(500).json({ message: 'Erro ao processar upload.' });
	}
});

module.exports = router;