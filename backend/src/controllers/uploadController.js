const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta uploads existe
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para armazenar arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Gera nome único: timestamp + userId + extensão original
    const userId = req.user?.id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${userId}-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas! (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

// Middleware de upload (single = um arquivo, campo 'image')
exports.uploadMiddleware = upload.single('image');

// Controller para fazer upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }

    // URL da imagem (ajusta automaticamente baseado na requisição)
    // Se BASE_URL estiver definido, usa ele. Caso contrário, constrói a partir da requisição
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || `localhost:${process.env.PORT || 3000}`;
      baseUrl = `${protocol}://${host}`;
    }
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    console.log('Imagem enviada com sucesso:', req.file.filename);
    console.log('URL da imagem:', imageUrl);

    res.status(200).json({
      message: 'Imagem enviada com sucesso!',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem.', error: error.message });
  }
};

// Controller para deletar imagem antiga (opcional, para limpeza)
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Imagem deletada com sucesso.' });
    } else {
      res.status(404).json({ message: 'Imagem não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro ao deletar imagem.', error: error.message });
  }
};

