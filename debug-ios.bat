@echo off
echo ========================================
echo    DEBUG ESPECÍFICO PARA iOS
echo ========================================
echo.

echo [1/8] Parando processos do Expo...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/8] Navegando para o diretório frontend...
cd frontend

echo [3/8] Verificando configurações atuais...
echo IP atual: 172.17.1.103
echo Plataforma: iOS 16.0.1
echo.

echo [4/8] Limpando cache do Expo...
call npx expo r -c

echo [5/8] Verificando dependências...
call npm list @react-native-async-storage/async-storage

echo [6/8] Testando conectividade com backend...
curl -s http://172.17.1.103:3000 || echo "❌ Backend não acessível"

echo [7/8] Iniciando com logs detalhados...
echo.
echo ========================================
echo    INICIANDO COM DEBUG COMPLETO
echo ========================================
echo.
echo Para iOS, use: npx expo start --tunnel --clear
echo.
echo IMPORTANTE: 
echo - Verifique os logs no console
echo - Procure por mensagens com emojis 🔍🔑🌐📱
echo - Se aparecer erro de rede, use --tunnel
echo.

pause
