// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }
    
    const token = authHeader.replace('Bearer ', '');

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Configuração do servidor ausente: JWT_SECRET.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Compat: expõe id tanto em req.user.id quanto em req.userId
        req.user = { id: decoded.id };
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};