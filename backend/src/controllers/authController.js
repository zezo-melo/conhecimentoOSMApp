const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa a Model de usuário

/**
 * Lógica para cadastrar um novo usuário.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, dob, docType, document, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já existe.' });
    }
    const newUser = new User({ name, email, dob, docType, document, phone, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

/**
 * Lógica para fazer o login do usuário.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Cria o token JWT. Garante que a chave está disponível.
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('Chave JWT_SECRET não está definida.');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


// Função para buscar os dados do perfil do usuário
exports.getProfile = async (req, res) => {
  try {
      // Compat: middleware expõe req.user.id e req.userId
      const userId = req.user?.id || req.userId;
      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      res.json(user); // Retorna os dados do usuário em JSON
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro do servidor.' });
  }
};


exports.updateProfile = async (req, res) => {
    const userId = req.user?.id || req.userId; 
    const updates = req.body; 
    let pointsAwarded = false;

    console.log('--- Iniciando atualização de perfil para userId:', userId, '---');
    console.log('Dados recebidos (updates):', updates);

    try {
        const user = await User.findById(userId); 

        if (!user) {
            console.log('ERRO: Usuário não encontrado.');
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        console.log('Status atual da missão:', user.profileMissionCompleted);
        console.log('Pontos atuais:', user.points);

        // 1. LÓGICA DA MISSÃO (perfil): conceder 10 pontos só uma vez, idempotente
        const profileCompletedBefore = Array.isArray(user.missionsCompleted) && user.missionsCompleted.includes('profile');

        // Critério simples de perfil "preenchido": nome e telefone presentes após atualização
        const finalName = updates.name ?? user.name;
        const finalPhone = updates.phone ?? user.phone;
        const isProfileFilled = Boolean(finalName) && Boolean(finalPhone);

        if (isProfileFilled && !profileCompletedBefore) {
            user.points += 10;
            user.missionsCompleted = Array.isArray(user.missionsCompleted) ? user.missionsCompleted : [];
            user.missionsCompleted.push('profile');
            user.profileMissionCompleted = true; // compat com frontend atual
            pointsAwarded = true;
            console.log('MISSÃO PERFIL COMPLETA! +10 pontos. Novos pontos:', user.points);
        }
        
        // 2. ATUALIZAÇÃO DOS DADOS DO PERFIL (Campos FLAT/ROOT e Sub-documentos)
        // Você deve garantir que TODOS os campos que o frontend envia são mapeados aqui.
        if (updates.name) user.name = updates.name; 
        if (updates.dob) user.dob = updates.dob;
        if (updates.docType) user.docType = updates.docType;
        if (updates.document) user.document = updates.document;
        if (updates.phone) user.phone = updates.phone;
        if (updates.bio !== undefined) user.bio = updates.bio || null;
        
        // Atualiza photoUrl (pode ser string base64 ou null/undefined)
        if (updates.photoUrl !== undefined) {
            if (updates.photoUrl && typeof updates.photoUrl === 'string' && updates.photoUrl.trim() !== '') {
                user.photoUrl = updates.photoUrl.trim();
                console.log('Foto atualizada. Tamanho da string:', updates.photoUrl.length, 'caracteres');
            } else {
                // Se for null, undefined ou string vazia, limpa a foto
                user.photoUrl = null;
                console.log('Foto removida/limpa');
            }
        }
        
        // Atualiza campos de ENDEREÇO (Sub-documento 'address')
        if (updates.address) {
            user.address = {
                ...user.address,
                ...updates.address,
            };
        }
        // Se a tela de edição envia city, state, zipCode etc. como campos de ROOT (e não dentro de 'address'):
        if (updates.city) user.address.city = updates.city;
        if (updates.state) user.address.state = updates.state; 
        if (updates.zipCode) user.address.zipCode = updates.zipCode;
        // Se a tela de edição tem o campo CEP, você precisa ter ele no User.js ou mapear ele aqui
        if (updates.zipCode && user.address) user.address.zipCode = updates.zipCode; 
        
        console.log('Salvando usuário no banco de dados...');
        console.log('PhotoUrl antes de salvar:', user.photoUrl ? `Sim (${user.photoUrl.substring(0, 50)}...)` : 'Não');
        await user.save(); 
        console.log('Usuário salvo com sucesso.');

        // 3. RETORNA O OBJETO ATUALIZADO
        const updatedUser = user.toObject();
        delete updatedUser.password;
        
        console.log('Retornando objeto atualizado para o frontend.');
        console.log('PhotoUrl no retorno:', updatedUser.photoUrl ? `Sim (${updatedUser.photoUrl.substring(0, 50)}...)` : 'Não');
        console.log('Novos pontos:', updatedUser.points, 'PointsAwarded:', pointsAwarded);

        return res.status(200).json(updatedUser); 

    } catch (error) {
        console.error('ERRO CRÍTICO AO SALVAR PERFIL:', error);
        return res.status(500).json({ message: 'Falha ao salvar o perfil.', error: error.message });
    }
};

