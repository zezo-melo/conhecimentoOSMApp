@echo off
echo Iniciando servidor de desenvolvimento...
echo.

echo 1. Iniciando backend na porta 3000...
start "Backend Server" cmd /k "cd backend && node server.js"

echo 2. Aguardando 3 segundos para o backend inicializar...
timeout /t 3 /nobreak >nul

echo 3. Iniciando frontend Expo...
cd frontend
npx expo start --clear --tunnel

pause
