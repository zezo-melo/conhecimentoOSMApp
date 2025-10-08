@echo off
echo Corrigindo versões do React Native para iOS...
echo.

cd frontend

echo Removendo node_modules e package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Reinstalando dependências...
npm install

echo Limpando cache do Expo...
npx expo start --clear

echo.
echo Pronto! Agora teste no iOS.
pause
