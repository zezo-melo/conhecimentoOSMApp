const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/leaderboard?limit=50
router.get('/', authMiddleware, async (req, res) => {
  try {
    const limitParam = Number(req.query.limit);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(1, limitParam), 200) : 50;
    const skipParam = Number(req.query.skip);
    const skip = Number.isFinite(skipParam) ? Math.max(0, skipParam) : 0;

    // Busca usuários ordenados por pontos (desc) e data (asc) para desempate estável
    const users = await User.find({}, 'name points photoUrl createdAt')
      .sort({ points: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const leaderboard = users.map((u, index) => ({
      position: index + 1,
      name: u.name,
      points: u.points || 0,
      photoUrl: u.photoUrl || null,
    }));

    // Se quiser incluir posição do usuário atual (mesmo fora do top N):
    let me = null;
    if (req.user?.id) {
      // Posição global do usuário atual
      const myDoc = await User.findById(req.user.id).select('points name photoUrl').lean();
      if (myDoc) {
        const higherCount = await User.countDocuments({ points: { $gt: myDoc.points || 0 } });
        me = {
          position: higherCount + 1,
          name: myDoc.name,
          points: myDoc.points || 0,
          photoUrl: myDoc.photoUrl || null,
        };
      }
    }

    const total = await User.countDocuments();
    res.json({ leaderboard, me, total });
  } catch (error) {
    console.error('Erro ao obter leaderboard:', error);
    res.status(500).json({ message: 'Erro do servidor.' });
  }
});

module.exports = router;


