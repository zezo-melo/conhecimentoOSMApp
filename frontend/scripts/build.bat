@echo off
REM Script para facilitar builds do app (Windows)
REM Uso: scripts\build.bat [android|ios|both]

set PLATFORM=%1
if "%PLATFORM%"=="" set PLATFORM=both

echo 🚀 Iniciando build do App Benefícios...

REM Verificar se está logado no EAS
eas whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ Você precisa estar logado no EAS. Execute: eas login
    exit /b 1
)

REM Verificar se EXPO_PUBLIC_API_URL está configurada
if "%EXPO_PUBLIC_API_URL%"=="" (
    echo ⚠️  ATENÇÃO: EXPO_PUBLIC_API_URL não está configurada!
    echo    Configure no eas.json ou exporte a variável:
    echo    set EXPO_PUBLIC_API_URL=https://seu-servidor.com/api
    set /p CONTINUE="   Deseja continuar mesmo assim? (s/N): "
    if /i not "%CONTINUE%"=="s" exit /b 1
)

if "%PLATFORM%"=="android" (
    echo 📱 Building Android APK...
    eas build --platform android --profile production-internal
) else if "%PLATFORM%"=="ios" (
    echo 🍎 Building iOS IPA...
    eas build --platform ios --profile production-internal
) else if "%PLATFORM%"=="both" (
    echo 📱 Building Android APK...
    eas build --platform android --profile production-internal --non-interactive
    
    echo 🍎 Building iOS IPA...
    eas build --platform ios --profile production-internal --non-interactive
) else (
    echo ❌ Plataforma inválida. Use: android, ios ou both
    exit /b 1
)

echo ✅ Build(s) iniciado(s)! Verifique o progresso em: https://expo.dev
echo 📋 Para ver a lista de builds: eas build:list

