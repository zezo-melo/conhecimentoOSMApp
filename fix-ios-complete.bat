@echo off
echo ========================================
echo    CORREÇÃO COMPLETA PARA iOS
echo ========================================
echo.

echo [1/8] Parando processos do Expo...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/8] Navegando para o diretório frontend...
cd frontend

echo [3/8] Removendo node_modules e package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo [4/8] Reinstalando dependências...
call npm install

echo [5/8] Instalando dependência específica para iOS...
call npx expo install react-native-worklets

echo [6/8] Verificando configurações do AsyncStorage...
call npm list @react-native-async-storage/async-storage

echo [7/8] Testando conectividade com backend...
curl -s http://172.17.1.103:3000 && echo "✅ Backend acessível" || echo "❌ Backend não acessível"

echo [8/8] Limpando cache e iniciando com configurações otimizadas para iOS...
echo.
echo ========================================
echo    INICIANDO SERVIDOR OTIMIZADO
echo ========================================
echo.
echo Para iOS, use: npx expo start --tunnel --clear
echo Para Android, use: npx expo start --clear
echo.
echo IMPORTANTE: 
echo - Verifique os logs no console
echo - Procure por mensagens com emojis 🔍🔑🌐📱
echo - Se aparecer erro de rede, use --tunnel
echo.

pause
