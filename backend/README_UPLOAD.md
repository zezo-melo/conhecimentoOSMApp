# Sistema de Upload de Imagens - Resumo

## O que foi implementado

✅ Endpoint de upload de imagens (`/api/upload`)
✅ Armazenamento de imagens na pasta `uploads/`
✅ Servir imagens estáticas via `/uploads/:filename`
✅ Frontend atualizado para usar upload em vez de base64
✅ Validação de tipo e tamanho de arquivo
✅ Geração automática de URLs

## Arquivos criados/modificados

### Backend:
- `package.json` - Adicionado `multer`
- `src/controllers/uploadController.js` - Controller de upload
- `src/routes/upload.js` - Rota de upload
- `server.js` - Configurado para servir arquivos estáticos
- `Dockerfile` - Criar pasta uploads

### Frontend:
- `app/editProfile.tsx` - Atualizado para usar upload

## Como usar no servidor

1. **Fazer commit das mudanças:**
```bash
git add .
git commit -m "Adiciona sistema de upload de imagens"
git push
```

2. **No servidor, fazer pull:**
```bash
cd /caminho/do/projeto
git pull
```

3. **Instalar nova dependência (multer):**
```bash
cd backend
npm install
```

4. **Recriar o Docker:**
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

Ou se estiver usando Docker diretamente:
```bash
docker build -t beneficios-backend .
docker stop beneficios-backend
docker rm beneficios-backend
docker run -d -p 8106:3000 --name beneficios-backend beneficios-backend
```

5. **Configurar BASE_URL (opcional):**
Se quiser URLs absolutas específicas, adicione no `.env`:
```env
BASE_URL=https://api-conhecimentos.mentorh.com
```

## Teste

1. Abra o app
2. Vá em Editar Perfil
3. Selecione uma foto
4. A foto será enviada automaticamente
5. Salve o perfil
6. Verifique se a foto aparece no ranking

## Notas

- As imagens são salvas em `backend/uploads/`
- URLs são geradas automaticamente
- Limite de 5MB por imagem
- Formatos aceitos: JPEG, JPG, PNG, GIF, WEBP

