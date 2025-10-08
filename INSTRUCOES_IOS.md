# Instruções para Corrigir Problema no iOS

## Problema
- Android funciona perfeitamente
- iOS mostra erro de incompatibilidade de versões do React Native
- Após dismiss do erro, o app carrega mas não consegue se comunicar com o backend

## Solução

### 1. Pare o Expo atual (Ctrl+C)

### 2. Execute os seguintes comandos no terminal:

```bash
# Navegar para o diretório frontend
cd frontend

# Remover node_modules e package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstalar dependências
npm install

# Limpar cache e reiniciar
npx expo start --clear
```

### 3. Teste no iOS

## O que foi alterado:

1. **React Native**: Ajustado de 0.81.4 para 0.79.5 (compatível com Expo Go)
2. **React**: Ajustado de 19.1.0 para 18.2.0 (compatível)
3. **@types/react**: Ajustado para versão compatível

## Por que isso resolve:

- O Expo Go no iOS usa uma versão específica do React Native
- Quando há incompatibilidade, o JavaScript não consegue se comunicar com o código nativo
- Isso quebra todas as funcionalidades que dependem do backend (login, logout, etc.)

## Após executar:

1. O erro de incompatibilidade deve desaparecer
2. Todas as funcionalidades do backend devem funcionar normalmente no iOS
3. O app deve funcionar igual no Android e iOS

## Se ainda não funcionar:

1. Feche completamente o Expo Go no iPhone
2. Reabra o app
3. Escaneie o QR code novamente
