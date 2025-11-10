#!/bin/bash

# Script para facilitar deploy do backend
# Uso: ./scripts/deploy.sh [build|start|stop|restart|logs]

set -e

COMMAND=${1:-start}

case $COMMAND in
    build)
        echo "🔨 Construindo imagem Docker..."
        docker build -t app-beneficios-backend .
        echo "✅ Imagem construída com sucesso!"
        ;;
    start)
        echo "🚀 Iniciando container..."
        if [ ! -f .env ]; then
            echo "❌ Arquivo .env não encontrado!"
            echo "   Copie env.example.txt para .env e configure:"
            echo "   cp env.example.txt .env"
            exit 1
        fi
        docker-compose up -d
        echo "✅ Container iniciado!"
        echo "📋 Ver logs: docker logs -f app-beneficios-backend"
        ;;
    stop)
        echo "🛑 Parando container..."
        docker-compose down
        echo "✅ Container parado!"
        ;;
    restart)
        echo "🔄 Reiniciando container..."
        docker-compose restart
        echo "✅ Container reiniciado!"
        ;;
    logs)
        echo "📋 Mostrando logs..."
        docker logs -f app-beneficios-backend
        ;;
    *)
        echo "❌ Comando inválido. Use: build, start, stop, restart ou logs"
        exit 1
        ;;
esac

