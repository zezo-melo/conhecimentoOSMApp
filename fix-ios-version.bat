@echo off
echo Corrigindo incompatibilidade de versões do React Native para iOS...
echo.

echo 1. Navegando para o diretório frontend...
cd frontend

echo 2. Limpando cache do npm...
npm cache clean --force

echo 3. Removendo node_modules...
if exist node_modules rmdir /s /q node_modules

echo 4. Removendo package-lock.json...
if exist package-lock.json del package-lock.json

echo 5. Reinstalando dependências...
npm install

echo 6. Limpando cache do Expo...
npx expo start --clear

echo.
echo Processo concluído! Agora teste no iOS.
pause
