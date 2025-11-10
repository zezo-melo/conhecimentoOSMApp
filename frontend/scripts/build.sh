#!/bin/bash

# Script para facilitar builds do app
# Uso: ./scripts/build.sh [android|ios|both]

set -e

PLATFORM=${1:-both}

echo "🚀 Iniciando build do App Benefícios..."

# Verificar se está logado no EAS
if ! eas whoami &> /dev/null; then
    echo "❌ Você precisa estar logado no EAS. Execute: eas login"
    exit 1
fi

# Verificar se EXPO_PUBLIC_API_URL está configurada
if [ -z "$EXPO_PUBLIC_API_URL" ]; then
    echo "⚠️  ATENÇÃO: EXPO_PUBLIC_API_URL não está configurada!"
    echo "   Configure no eas.json ou exporte a variável:"
    echo "   export EXPO_PUBLIC_API_URL=https://seu-servidor.com/api"
    read -p "   Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

case $PLATFORM in
    android)
        echo "📱 Building Android APK..."
        eas build --platform android --profile production-internal
        ;;
    ios)
        echo "🍎 Building iOS IPA..."
        eas build --platform ios --profile production-internal
        ;;
    both)
        echo "📱 Building Android APK..."
        eas build --platform android --profile production-internal --non-interactive
        
        echo "🍎 Building iOS IPA..."
        eas build --platform ios --profile production-internal --non-interactive
        ;;
    *)
        echo "❌ Plataforma inválida. Use: android, ios ou both"
        exit 1
        ;;
esac

echo "✅ Build(s) iniciado(s)! Verifique o progresso em: https://expo.dev"
echo "📋 Para ver a lista de builds: eas build:list"

