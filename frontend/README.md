# App Benefícios - Banco BRB

Aplicativo móvel de benefícios para clientes do banco, desenvolvido em React Native com Expo.

## 🚀 Funcionalidades

### �� Páginas Principais (Barra de Navegação)

#### 1. **Missões (Home)**
- Lista de missões diárias e semanais
- Sistema de pontos por missão completada
- Interface visual com timeline vertical
- Promoção destacada no final da página

#### 2. **Rank**
- Ranking dos usuários com mais pontos
- Pódio visual (1º, 2º e 3º lugar)
- Lista completa do ranking
- Sistema de níveis e medalhas

#### 3. **Shop**
- Catálogo de produtos para troca por pontos
- Filtros por categoria
- Sistema de compra com pontos
- Produtos com desconto exclusivo

#### 4. **Profile**
- Perfil do usuário com avatar
- Estatísticas pessoais
- Configurações da conta
- Menu de opções

### 🍔 Menu Lateral (Drawer)

#### 5. **Descontos**
- Catálogo de promoções exclusivas
- Filtros por categoria (Calçados, Educação, Alimentação, etc.)
- Cards de promoção com desconto, validade e categoria
- Interface moderna e responsiva

#### 6. **Cursos**
- Catálogo de cursos com desconto
- Sistema de pontos para inscrição
- Filtros por categoria (Finanças, Marketing, Tecnologia, etc.)
- Informações detalhadas: instrutor, duração, nível, preços

#### 7. **Pontos**
- Dashboard de pontos do usuário
- Sistema de níveis (Prata, Ouro, etc.)
- Gráfico de evolução mensal
- Histórico de missões completadas
- Ranking entre usuários

#### 8. **Extrato**
- Histórico completo de transações
- Resumo financeiro (entradas/saídas)
- Filtros por categoria de transação
- Informações da conta bancária

## 🛠️ Tecnologias Utilizadas

- **React Native** com Expo
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **Expo Router** com Drawer Navigation
- **Expo Vector Icons** para ícones
- **Context API** para gerenciamento de estado

## 📱 Estrutura do Projeto

```
app/
├── (tabs)/                    # Abas principais (4 páginas)
│   ├── index.tsx             # Página de Missões (Home)
│   ├── rank.tsx              # Página de Ranking
│   ├── shop.tsx              # Página da Loja
│   ├── profile.tsx           # Página de Perfil
│   └── _layout.tsx           # Layout das abas
├── descontos.tsx             # Página de Descontos (menu lateral)
├── cursos.tsx                # Página de Cursos (menu lateral)
├── pontos.tsx                # Página de Pontos (menu lateral)
├── extrato.tsx               # Página de Extrato (menu lateral)
├── _layout.tsx               # Layout principal com drawer
└── login.tsx                 # Página de login

components/
├── Header.tsx                # Componente de cabeçalho
├── DrawerContent.tsx         # Conteúdo do menu lateral
└── ...                       # Outros componentes

contexts/
├── AuthContext.tsx           # Contexto de autenticação
└── ...                       # Outros contextos
```

## 🎯 Sistema de Pontos

### Como Ganhar Pontos
- Completar missões diárias
- Participar de desafios
- Fazer login consecutivo
- Convidar amigos
- Avaliar o app
- Comprar conteúdo

### Como Usar Pontos
- Inscrição em cursos com desconto
- Conversão para cashback
- Acesso a promoções exclusivas
- Descontos em produtos e serviços
- Compra de produtos na shop

## 🎨 Design System

### Cores Principais
- **Azul Principal**: `#0e76e0`
- **Azul Secundário**: `#1976D2`
- **Verde**: `#28a745`
- **Vermelho**: `#dc3545`
- **Amarelo**: `#ffc107`

### Tipografia
- **Títulos**: 28px, 24px, 20px, 18px
- **Corpo**: 16px, 14px, 12px
- **Pesos**: Bold (600-700), Regular (400-500)

### Componentes
- Cards com sombras e bordas arredondadas
- Chips de filtro interativos
- Botões com estados de hover/press
- Ícones emoji para categorias

## 📊 Dados de Exemplo

### Promoções
- Tênis Esportivo: 20% OFF
- Curso de Investimentos: 30% OFF
- Restaurante Premium: 25% OFF
- Cinema: 2x1
- Academia: 50% OFF

### Cursos
- Investimentos para Iniciantes
- Marketing Digital Avançado
- Programação Web Full Stack
- Gestão de Projetos
- Inglês para Negócios

### Produtos da Shop
- Cupom de Desconto 20%
- Curso de Finanças
- Assinatura Academia
- Ingresso Cinema
- Livro Digital
- Consulta Nutricional

## 🚀 Como Executar

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Executar o app**
   ```bash
   npx expo start
   ```

3. **Abrir no dispositivo**
   - Escanear QR Code com Expo Go
   - Ou pressionar 'a' para Android
   - Ou pressionar 'i' para iOS

## 📱 Requisitos

- Node.js 16+
- Expo CLI
- Dispositivo móvel ou emulador
- Expo Go app (para testes)

## 🔧 Configuração

### Variáveis de Ambiente
- Configurar API endpoints
- Chaves de autenticação
- URLs de serviços

### Banco de Dados
- Configurar conexão com banco
- Migrations e seeds
- Backup automático

## 📈 Próximas Funcionalidades

- [ ] Sistema de notificações push
- [ ] Integração com carteira digital
- [ ] Gamificação avançada
- [ ] Relatórios e analytics
- [ ] Integração com redes sociais
- [ ] Sistema de recompensas personalizadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@banco.com
- Telefone: 0800 123 4567
- Chat: Disponível no app

---

**Desenvolvido com ❤️ pela equipe de desenvolvimento do Banco BRB**
