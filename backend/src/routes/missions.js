// backend/src/routes/missions.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Dados das missões e perguntas
const MISSION_DATA = {
  quiz2: {
    id: 'quiz2',
    title: 'Desafio de Conhecimento',
    description: 'Teste seus conhecimentos sobre o sistema MENTORH',
    questions: [
      {
        id: 1,
        title: 'Ao ingressar no órgão onde é realizado o cadastro com os dados básicos no MENTORH?',
        options: [
          { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
          { key: 'B', text: 'Dados Funcionais > Pessoas > Cadastro' },
          { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
          { key: 'D', text: 'Tabelas Básicas e Cadastrais > Institucional' },
        ],
        correct: 'B'
      },
      {
        id: 2,
        title: 'Após ingressado no órgão e cadastrado os dados básicos do servidor, onde é realizado o cadastro com os dados funcionais no MENTORH?',
        options: [
          { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
          { key: 'B', text: 'Administração > Parametrização > Parametros do Sistema' },
          { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
          { key: 'D', text: 'Tabelas Básicas e Cadastrais > Institucional' },
        ],
        correct: 'A'
      },
      {
        id: 3,
        title: 'Qual módulo é cadastrado no MENTORH Cargo Efetivo?',
        options: [
          { key: 'A', text: 'Administração > Parametrização > Parametros do Sistema' },
          { key: 'B', text: 'Folha de Pagamento > Prepara Cálculo > Congelamento de Dados' },
          { key: 'C', text: 'Dados Funcionais > Cargo Efetivo > Cadastro' },
          { key: 'D', text: 'Dados Funcionais > Movimentação' },
        ],
        correct: 'C'
      },
      {
        id: 4,
        title: 'Servidor informou ao órgão que possui 2 dependentes, onde é realizado o cadastro?',
        options: [
          { key: 'A', text: 'Dados Funcionais > Pensão Alimentícia' },
          { key: 'B', text: 'Dados Funcionais > Cadastro de Dependentes' },
          { key: 'C', text: 'Estágio Probatório > Avaliação > Cadastro' },
          { key: 'D', text: 'Frequência > Férias > Concessão' },
        ],
        correct: 'B'
      },
      {
        id: 5,
        title: 'Servidor completou 12 meses de ingresso ao órgão e deseja marcar as suas férias, contudo é necessário realizar dois cadastros: concessão e gozo. Qual é o módulo para cadastro da Concessão?',
        options: [
          { key: 'A', text: 'Frequência > Férias > Concessão' },
          { key: 'B', text: 'Frequência > Férias > Gozo' },
          { key: 'C', text: 'Frequência > Ficha de Frequência > Emissão' },
          { key: 'D', text: 'Frequência > Ponto Eletrônico > Horário Individual > Cadastro Horário Individual' },
        ],
        correct: 'A'
      },
      {
        id: 6,
        title: 'Servidor com atestado de 10 dias. Onde registrar o afastamento?',
        options: [
          { key: 'A', text: 'Frequência > Afastamento > Cadastro' },
          { key: 'B', text: 'Frequência > Licença Prêmio/Capacitação > Concessão' },
          { key: 'C', text: 'Treinamento / Capacitação > Formação Acadêmica' },
          { key: 'D', text: 'Registro Funcional > Abono de Permanência' },
        ],
        correct: 'A'
      },
      {
        id: 7,
        title: 'Qual módulo é cadastrado o Regime Jurídico do servidor?',
        options: [
          { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
          { key: 'B', text: 'Registro Funcional > Regime Jurídico' },
          { key: 'C', text: 'Folha de Pagamento > Prepara Cálculo > Congelamento de Dados' },
          { key: 'D', text: 'Estágio Probatório > Avaliação > Cadastro' },
        ],
        correct: 'B'
      },
      {
        id: 8,
        title: 'Qual módulo eu busco as informações sobre condição de processamento?',
        options: [
          { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
          { key: 'B', text: 'Dados Funcionais > Pensão Alimentícia' },
          { key: 'C', text: 'Frequência > Licença Prêmio/Capacitação > Concessão' },
          { key: 'D', text: 'Administração > Condição de Processamento' },
        ],
        correct: 'D'
      },
      {
        id: 9,
        title: 'Qual módulo eu seleciono uma determinada folha?',
        options: [
          { key: 'A', text: 'Folha de Pagamento > Controle da Folha > Abre/Fecha Folha' },
          { key: 'B', text: 'Folha de Pagamento > Seleção de Folha' },
          { key: 'C', text: 'Folha de Pagamento > Fechamento > Folha Calculada' },
          { key: 'D', text: 'Folha de Pagamento > Prepara Cálculo > Benefícios' },
        ],
        correct: 'B'
      },
      {
        id: 10,
        title: 'Qual caminho/módulo eu posso acessar a folha de um determinado servidor?',
        options: [
          { key: 'A', text: 'Folha de Pagamento > Seleção de Folha' },
          { key: 'B', text: 'Folha de Pagamento > Lançamentos > Transfere Rubrica' },
          { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
          { key: 'D', text: 'Folha de Pagamento > Lançamentos > Devolução/Reposição' },
        ],
        correct: 'C'
      }
    ]
  },
  quiz3: {
    id: 'quiz3',
    title: 'Desafio de Conhecimento',
    description: 'Assista ao vídeo e responda as perguntas baseadas no conteúdo',
    videoUrl: 'u31qwQUeGuM', // Substitua pelo ID real do vídeo
    questions: [
      {
        id: 1,
        title: 'Pergunta baseada no vídeo 1',
        options: [
          { key: 'A', text: 'Opção A' },
          { key: 'B', text: 'Opção B' },
          { key: 'C', text: 'Opção C' },
          { key: 'D', text: 'Opção D' },
        ],
        correct: 'A'
      },
      {
        id: 2,
        title: 'Pergunta baseada no vídeo 2',
        options: [
          { key: 'A', text: 'Opção A' },
          { key: 'B', text: 'Opção B' },
          { key: 'C', text: 'Opção C' },
          { key: 'D', text: 'Opção D' },
        ],
        correct: 'B'
      }
    ]
  },
  quiz4: {
    id: 'quiz4',
    title: 'Desafio de Conhecimento',
    description: 'Assista ao vídeo e responda as perguntas baseadas no conteúdo',
    videoUrl: 'u31qwQUeGuM', // ID do vídeo do YouTuber
    questions: [
      {
        id: 1,
        title: 'Pergunta baseada no vídeo 1',
        options: [
          { key: 'A', text: 'Opção A' },
          { key: 'B', text: 'Opção B' },
          { key: 'C', text: 'Opção C' },
          { key: 'D', text: 'Opção D' },
        ],
        correct: 'A'
      },
      {
        id: 2,
        title: 'Pergunta baseada no vídeo 2',
        options: [
          { key: 'A', text: 'Opção A' },
          { key: 'B', text: 'Opção B' },
          { key: 'C', text: 'Opção C' },
          { key: 'D', text: 'Opção D' },
        ],
        correct: 'B'
      }
    ]
  }
};

// Rota para obter dados da missão
router.get('/mission/:missionId', authMiddleware, async (req, res) => {
  try {
    const { missionId } = req.params;
    const missionData = MISSION_DATA[missionId];
    
    if (!missionData) {
      return res.status(404).json({ message: 'Missão não encontrada.' });
    }
    
    res.json(missionData);
  } catch (error) {
    console.error('Erro ao obter dados da missão:', error);
    res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para completar a primeira missão
router.post('/complete-first-mission', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionPoints = 10;

    // Buscar o usuário pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o usuário já tem pontos de perfil preenchido
    if (user.missions > 0) { 
        return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    // Atualizar os pontos e o contador de missões do usuário
    user.points += missionPoints;
    user.missions += 1; // Incrementa o contador de missões completadas
    await user.save();

    res.json({
      message: 'Missão completada! Você ganhou ' + missionPoints + ' pontos.',
      user: user, // Retorna os dados atualizados do usuário
    });

  } catch (error) {
    console.error('Erro ao completar missão:', error);
    res.status(500).json({ message: 'Erro do servidor.' });
  }
});

module.exports = router;
 
// Nova rota: completar missão do quiz (Missão 2)
router.post('/complete-quiz-mission', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = 'quiz2';
    const { correctCount, timeSpent } = req.body || {}; // timeSpent em segundos

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Já completou a missão 2?
    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    const safeCorrectCount = Number.isFinite(correctCount) ? Math.max(0, Math.min(10, Number(correctCount))) : 0;
    const safeTimeSpent = Number.isFinite(timeSpent) ? Math.max(0, Number(timeSpent)) : 0;
    
    // Cálculo de pontos baseado em acertos e tempo
    let basePoints = safeCorrectCount * 2; // 2 pontos por acerto
    let timeBonus = 0;
    
    // Bônus de tempo: quanto mais rápido, mais pontos
    if (safeTimeSpent > 0) {
      const maxTime = 300; // 5 minutos máximo para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * 10); // Até 10 pontos de bônus por velocidade
    }
    
    const missionPoints = Math.min(30, basePoints + timeBonus); // Máximo 30 pontos

    user.points += missionPoints;
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    await user.save();

    return res.json({
      message: `Missão 2 concluída! Você ganhou ${missionPoints} pontos (${basePoints} por acertos + ${timeBonus} bônus de velocidade).`,
      user,
      pointsBreakdown: {
        basePoints,
        timeBonus,
        totalPoints: missionPoints
      }
    });
  } catch (error) {
    console.error('Erro ao completar missão 2:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para completar missão 3 (quiz com vídeo)
router.post('/complete-quiz-mission-3', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = 'quiz3';
    const { correctCount, timeSpent } = req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    const safeCorrectCount = Number.isFinite(correctCount) ? Math.max(0, Math.min(2, Number(correctCount))) : 0;
    const safeTimeSpent = Number.isFinite(timeSpent) ? Math.max(0, Number(timeSpent)) : 0;
    
    let basePoints = safeCorrectCount * 5; // 5 pontos por acerto
    let timeBonus = 0;
    
    if (safeTimeSpent > 0) {
      const maxTime = 180; // 3 minutos máximo para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * 5); // Até 5 pontos de bônus
    }
    
    const missionPoints = Math.min(15, basePoints + timeBonus);

    user.points += missionPoints;
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    await user.save();

    return res.json({
      message: `Missão 3 concluída! Você ganhou ${missionPoints} pontos.`,
      user,
      pointsBreakdown: {
        basePoints,
        timeBonus,
        totalPoints: missionPoints
      }
    });
  } catch (error) {
    console.error('Erro ao completar missão 3:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para completar missão 4 (quiz com vídeo)
router.post('/complete-quiz-mission-4', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = 'quiz4';
    const { correctCount, timeSpent } = req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    const safeCorrectCount = Number.isFinite(correctCount) ? Math.max(0, Math.min(2, Number(correctCount))) : 0;
    const safeTimeSpent = Number.isFinite(timeSpent) ? Math.max(0, Number(timeSpent)) : 0;
    
    let basePoints = safeCorrectCount * 5; // 5 pontos por acerto
    let timeBonus = 0;
    
    if (safeTimeSpent > 0) {
      const maxTime = 180; // 3 minutos máximo para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * 5); // Até 5 pontos de bônus
    }
    
    const missionPoints = Math.min(15, basePoints + timeBonus);

    user.points += missionPoints;
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    await user.save();

    return res.json({
      message: `Missão 4 concluída! Você ganhou ${missionPoints} pontos.`,
      user,
      pointsBreakdown: {
        basePoints,
        timeBonus,
        totalPoints: missionPoints
      }
    });
  } catch (error) {
    console.error('Erro ao completar missão 4:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para abrir baú de bônus
router.post('/open-chest', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chestId, points } = req.body;

    if (!chestId || !points) {
      return res.status(400).json({ message: 'ID do baú e pontos são obrigatórios.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o baú já foi aberto
    if (user.chestsOpened && user.chestsOpened.includes(chestId)) {
      return res.status(400).json({ message: 'Este baú já foi aberto.' });
    }

    // Adicionar pontos e marcar baú como aberto
    user.points += points;
    user.chestsOpened = Array.isArray(user.chestsOpened) ? user.chestsOpened : [];
    user.chestsOpened.push(chestId);
    
    await user.save();

    return res.json({
      message: `Baú aberto! Você ganhou ${points} pontos de bônus!`,
      user,
      pointsAwarded: points
    });
  } catch (error) {
    console.error('Erro ao abrir baú:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});