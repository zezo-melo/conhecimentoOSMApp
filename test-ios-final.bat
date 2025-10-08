@echo off
echo ========================================
echo    TESTE FINAL PARA iOS
echo ========================================
echo.

echo [1/4] Verificando versões das dependências...
npx expo-doctor

echo.
echo [2/4] Testando conectividade com backend...
curl -s http://172.17.1.103:3000 && echo "✅ Backend acessível" || echo "❌ Backend não acessível"

echo.
echo [3/4] Limpando cache do Expo...
npx expo r -c

echo.
echo [4/4] Iniciando servidor com configurações otimizadas para iOS...
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
