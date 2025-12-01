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
  },

  quiz5: {
    id: 'quiz5',
    title: 'Missão 6: Desafio de Processos',
    description: 'Teste seus conhecimentos sobre os processos e fluxos de atendimento internos.',
    questions: [
      {
        id: 1,
        title: 'De acordo com o fluxo, quem realiza a triagem inicial dos chamados?',
        options: [
          { key: 'A', text: 'N2' },
          { key: 'B', text: 'Cliente' },
          { key: 'C', text: 'N1' },
          { key: 'D', text: 'Desenvolvimento' },
        ],
        correct: 'C'
      },
      {
        id: 2,
        title: 'Qual deve ser a classificação correta da severidade em uma manutenção corretiva?',
        options: [
          { key: 'A', text: 'Normal ou planejada' },
          { key: 'B', text: 'Baixa, média ou alta' },
          { key: 'C', text: 'Interna' },
          { key: 'D', text: 'Padrão' },
        ],
        correct: 'B'
      },
      {
        id: 3,
        title: 'Qual é o prazo máximo para o cliente responder a uma solicitação antes do cancelamento do chamado?',
        options: [
          { key: 'A', text: '10 dias' },
          { key: 'B', text: '12 dias' },
          { key: 'C', text: '15 dias' },
          { key: 'D', text: '16 dias' },
        ],
        correct: 'D'
      },
      {
        id: 4,
        title: 'Quem analisa as sugestões de melhoria encaminhadas pela equipe?',
        options: [
          { key: 'A', text: 'Juliana Juvêncio e Luiz Fernando' },
          { key: 'B', text: 'Renan, Naira, Matheus e Daniel' },
          { key: 'C', text: 'Sara e Sabrina' },
          { key: 'D', text: 'Gessika e Helen' },
        ],
        correct: 'B'
      },
      {
        id: 5,
        title: 'O pedido de extensão de prazo deve ser feito:',
        options: [
          { key: 'A', text: 'Após transferir o chamado ao N2' },
          { key: 'B', text: 'Antes da transferência para o N2' },
          { key: 'C', text: 'Somente se o cliente autorizar' },
          { key: 'D', text: 'Durante o fechamento do chamado' },
        ],
        correct: 'B'
      },
      {
        id: 6,
        title: 'Qual é o foco principal dos chamados de Sara Batista Lima Quinta?',
        options: [
          { key: 'A', text: 'Ponto eletrônico e eSocial' },
          { key: 'B', text: 'Mensageria e folha de pagamento' },
          { key: 'C', text: 'Relatórios e dashboards' },
          { key: 'D', text: 'Chamados do CNMP' },
        ],
        correct: 'B'
      },
    ]
  },

  quiz6: {
    id: 'quiz6',
    title: 'Desafio: Processo de Chamados',
    description: 'Verifique seus conhecimentos sobre as regras de atendimento e chamados (Verdadeiro/Falso).',
    points: 20,
    questions: [
      {
        id: 1,
        title: 'A equipe N1 deve sempre justificar qualquer mudança de severidade ou natureza de chamado.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'A' // ✅ Verdadeiro
      },
      {
        id: 2,
        title: 'Chamados de manutenção corretiva podem ser classificados como "planejados".',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'B' // ❌ Falso
      },
      {
        id: 3,
        title: 'O cliente do MPRO pode contatar Sara Batista Lima Quinta diretamente por telefone ou e-mail.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'A' // ✅ Verdadeiro
      },
      {
        id: 4,
        title: 'Se o cliente não responder em 16 dias, o chamado é automaticamente fechado sem notificação.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'B' // ❌ Falso
      },
    ],
  },

  quiz7: {
    id: 'quiz7',
    title: 'Desafio: Processo de Chamados - Parte 2',
    description: 'Teste seus conhecimentos sobre sugestões de melhoria, SLA e fluxo de chamados (Verdadeiro/Falso).',
    points: 20,
    questions: [
      {
        id: 1,
        title: 'Sugestões de melhoria são avaliadas apenas por Juliana Juvêncio.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'B' // ❌ Falso
      },
      {
        id: 2,
        title: 'A equipe N1 pode solicitar renegociação de SLA mesmo sem resposta do cliente.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'A' // ✅ Verdadeiro
      },
      {
        id: 3,
        title: 'Após o N2 atender um chamado, ele nunca retorna ao N1.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'B' // ❌ Falso — Retorna para ajustes de SLA ou finalização.
      },
      {
        id: 4,
        title: 'O painel de suporte mostra chamados na fila, aguardando o cliente e em homologação.',
        options: [
          { key: 'A', text: 'Verdadeiro' },
          { key: 'B', text: 'Falso' },
        ],
        correct: 'A' // ✅ Verdadeiro
      },
    ],
  },

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
    // A lógica original usa 'user.missions > 0', mas para 'profile' é melhor usar o missionCompleted
    if (user.missionsCompleted && user.missionsCompleted.includes('profile')) { 
        return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    // Atualizar os pontos e o contador de missões do usuário
    user.points += missionPoints;
    user.missions += 1; // Incrementa o contador de missões completadas
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push('profile'); // Adiciona o ID da missão de perfil
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
    let basePoints = safeCorrectCount * 2; // 2 pontos por acerto (Max 20)
    let timeBonus = 0;
    
    // Bônus de tempo: quanto mais rápido, mais pontos (Max 10)
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
    
    let basePoints = safeCorrectCount * 5; // 5 pontos por acerto (Max 10)
    let timeBonus = 0;
    
    if (safeTimeSpent > 0) {
      const maxTime = 180; // 3 minutos máximo para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * 5); // Até 5 pontos de bônus (Max Total 15)
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
    
    let basePoints = safeCorrectCount * 5; // 5 pontos por acerto (Max 10)
    let timeBonus = 0;
    
    if (safeTimeSpent > 0) {
      const maxTime = 180; // 3 minutos máximo para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * 5); // Até 5 pontos de bônus (Max Total 15)
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

// Rota para completar missão de Caça Palavras (Missão 13)
router.post('/complete-word-search', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = 'cacaPalavras'; 
    const { timeSpent } = req.body || {}; // O frontend envia apenas o tempo gasto
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Já completou a missão 13?
    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    const safeTimeSpent = Number.isFinite(timeSpent) ? Math.max(0, Number(timeSpent)) : 0;
    
    // Lógica de pontos: 15 pontos base + bônus por tempo
    const basePoints = 15; 
    let timeBonus = 0;
    
    // Bônus de tempo: 1 ponto a cada 60 segundos economizado abaixo de 300s (5 minutos)
    if (safeTimeSpent > 0) {
      const maxTimeForBonus = 300; // 5 minutos = 300 segundos
      const timeSaved = maxTimeForBonus - safeTimeSpent;
      timeBonus = Math.max(0, Math.floor(timeSaved / 60)); // 1 ponto de bônus por minuto rápido (Max 4)
    }
    
    const missionPoints = basePoints + timeBonus; // Max 19 pontos

    // Atualiza o perfil do usuário
    user.points += missionPoints;
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    await user.save();

    return res.json({
      message: `Missão ${missionId} (Caça Palavras) concluída! Você ganhou ${missionPoints} pontos.`,
      user,
      pointsBreakdown: {
        basePoints,
        timeBonus,
        totalPoints: missionPoints
      }
    });
  } catch (error) {
    console.error('Erro ao completar missão Caça Palavras:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para completar missão 5
router.post('/complete-quiz-mission-5', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = 'quiz5'; 

    const { correctCount, timeSpent } = req.body || {}; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    // Lógica de Pontuação: 6 questões, 3 pontos por acerto. Max Base: 18. Max Total: 20. Max Bônus: 2.
    const totalQuestions = 6;
    const maxTotalPoints = 20;
    const maxBonusPoints = 2; // 20 - (6 * 3)

    // Garante que o correctCount é um número entre 0 e 6.
    const safeCorrectCount = Number.isFinite(correctCount) ? Math.max(0, Math.min(totalQuestions, Number(correctCount))) : 0;
    const safeTimeSpent = Number.isFinite(timeSpent) ? Math.max(0, Number(timeSpent)) : 0;
    
    let basePoints = safeCorrectCount * 3;
    let timeBonus = 0; 
    
    // Lógica de Bônus (similar a quiz3/4, com limite de 2 pontos)
    if (safeTimeSpent > 0) {
      const maxTime = 180; // 3 minutos para bônus
      const timeRatio = Math.max(0, (maxTime - safeTimeSpent) / maxTime);
      timeBonus = Math.floor(timeRatio * maxBonusPoints); // Até 2 pontos de bônus
    }
    
    const missionPoints = Math.min(maxTotalPoints, basePoints + timeBonus); // Garante que não ultrapasse 20

    // Salva o progresso no banco de dados, substituindo a chamada à função 'completeMission'
    user.points += missionPoints;
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    await user.save();

    return res.status(200).json({ 
      message: `Missão 5 concluída! Você ganhou ${missionPoints} pontos (${basePoints} por acertos + ${timeBonus} bônus de velocidade).`, 
      user, 
      pointsBreakdown: { basePoints, timeBonus, totalPoints: missionPoints } 
    });
  } catch (error) {
    console.error('Erro ao completar missão quiz5:', error);
    return res.status(500).json({ message: 'Erro do servidor.' });
  }
});

// Rota para completar a Missão 6 (quiz6)
router.post('/complete-mission-quiz6', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let { totalTime, correctAnswers } = req.body;
    const missionId = 'quiz6';

    // 🚨 VALIDAÇÃO OBRIGATÓRIA PARA O ERRO 400
    if (typeof totalTime === 'undefined' || typeof correctAnswers === 'undefined') {
      return res.status(400).json({ message: 'Dados incompletos: totalTime e correctAnswers são obrigatórios.' });
    }
    
    // Garante que são números (converte string para number, se necessário)
    totalTime = Number(totalTime);
    correctAnswers = Number(correctAnswers);

    // Validação extra se não forem números válidos
    if (isNaN(totalTime) || isNaN(correctAnswers)) {
      return res.status(400).json({ message: 'Valores inválidos fornecidos para tempo ou acertos.' });
    }

    const missionData = MISSION_DATA[missionId]; 
    if (!missionData) {
      return res.status(404).json({ message: 'Missão (dados) não encontrada.' });
    }

    const totalQuestions = missionData.questions.length;
    
    // Lógica de cálculo de pontos
    const basePoints = 15; // Usando um valor base, se não estiver em MISSION_DATA
    
    // Cálculo de bônus baseado no acerto
    const correctRatio = correctAnswers / totalQuestions;
    const baseBonus = 5; 
    const finalBonus = Math.round(baseBonus * correctRatio);
    const missionPoints = basePoints + finalBonus; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Lógica para salvar a conclusão e os pontos
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    if (!user.missionsCompleted.includes(missionId)) {
      user.missionsCompleted.push(missionId);
      user.points += missionPoints;
      await user.save();
    }
    
    // Resposta de sucesso
    return res.json({ 
      message: `Missão ${missionId} completada com sucesso! Você ganhou ${missionPoints} pontos.`, 
      user, 
      pointsBreakdown: { basePoints, finalBonus, totalPoints: missionPoints } 
    });

  } catch (error) {
    console.error('Erro ao completar missão quiz6:', error);
    // Esta mensagem aparece no log do backend
    return res.status(500).json({ message: 'Erro do servidor ao tentar finalizar a missão.' });
  }
});

// Rota para completar a Missão 7 (quiz7)
router.post('/complete-mission-quiz7', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let { totalTime, correctAnswers } = req.body;
    const missionId = 'quiz7';

    // 🚨 VALIDAÇÃO OBRIGATÓRIA PARA O ERRO 400
    if (typeof totalTime === 'undefined' || typeof correctAnswers === 'undefined') {
      return res.status(400).json({ message: 'Dados incompletos: totalTime e correctAnswers são obrigatórios.' });
    }
    
    // Garante que são números (converte string para number, se necessário)
    totalTime = Number(totalTime);
    correctAnswers = Number(correctAnswers);

    // Validação extra se não forem números válidos
    if (isNaN(totalTime) || isNaN(correctAnswers)) {
      return res.status(400).json({ message: 'Valores inválidos fornecidos para tempo ou acertos.' });
    }

    const missionData = MISSION_DATA[missionId]; 
    if (!missionData) {
      return res.status(404).json({ message: 'Missão (dados) não encontrada.' });
    }

    const totalQuestions = missionData.questions.length;
    
    // Lógica de cálculo de pontos
    const basePoints = 15; // Usando um valor base, se não estiver em MISSION_DATA
    
    // Cálculo de bônus baseado no acerto
    const correctRatio = correctAnswers / totalQuestions;
    const baseBonus = 5; 
    const finalBonus = Math.round(baseBonus * correctRatio);
    const missionPoints = basePoints + finalBonus; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se já completou a missão
    if (user.missionsCompleted && user.missionsCompleted.includes(missionId)) {
      return res.status(400).json({ message: 'Esta missão já foi completada.' });
    }

    // Lógica para salvar a conclusão e os pontos
    user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
    user.missionsCompleted.push(missionId);
    user.points += missionPoints;
    await user.save();
    
    // Resposta de sucesso
    return res.json({ 
      message: `Missão ${missionId} completada com sucesso! Você ganhou ${missionPoints} pontos.`, 
      user, 
      pointsBreakdown: { basePoints, finalBonus, totalPoints: missionPoints } 
    });

  } catch (error) {
    console.error('Erro ao completar missão quiz7:', error);
    return res.status(500).json({ message: 'Erro do servidor ao tentar finalizar a missão.' });
  }
});

// Mapa de baús e pontos definidos no servidor (não confiar em valores enviados pelo cliente)
const CHEST_POINTS = {
  chest1: 5,
  chest2: 10,
  chest3: 15,
};

// Rota para abrir baú de bônus
router.post('/open-chest', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chestId } = req.body || {};

    if (!chestId) {
      return res.status(400).json({ message: 'ID do baú é obrigatório.' });
    }

    const points = CHEST_POINTS[chestId];
    if (!points) {
      return res.status(400).json({ message: 'Baú inválido.' });
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

module.exports = router;