# Instruções de Upload de Imagens

## Configuração

### 1. Variável de Ambiente BASE_URL

Adicione a variável `BASE_URL` no seu arquivo `.env` ou nas variáveis de ambiente do servidor:

```env
BASE_URL=https://api-conhecimentos.mentorh.com
```

Ou se estiver rodando localmente:
```env
BASE_URL=http://localhost:3000
```

Esta URL será usada para gerar os links das imagens enviadas.

### 2. Pasta uploads

A pasta `uploads` será criada automaticamente quando o servidor iniciar. Certifique-se de que o servidor tem permissão de escrita nesta pasta.

### 3. Docker

Se estiver usando Docker, a pasta `uploads` será criada automaticamente pelo Dockerfile. Certifique-se de mapear um volume se quiser persistir as imagens:

```yaml
volumes:
  - ./uploads:/usr/src/app/uploads
```

## Endpoints

### POST /api/upload
Faz upload de uma imagem de perfil.

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
- `image`: arquivo de imagem (multipart/form-data)

**Resposta:**
```json
{
  "message": "Imagem enviada com sucesso!",
  "imageUrl": "http://localhost:3000/uploads/profile-userId-timestamp.jpg",
  "filename": "profile-userId-timestamp.jpg"
}
```

### DELETE /api/upload/:filename
Deleta uma imagem (opcional, para limpeza).

**Headers:**
- `Authorization: Bearer <token>`

## Uso no Frontend

O frontend agora faz upload da imagem antes de salvar o perfil. A URL retornada é salva no campo `photoUrl` do usuário.

## Limites

- Tamanho máximo do arquivo: 5MB
- Formatos aceitos: JPEG, JPG, PNG, GIF, WEBP

