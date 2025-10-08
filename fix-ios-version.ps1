# Script para corrigir incompatibilidade de versões do React Native no iOS
Write-Host "Corrigindo incompatibilidade de versões do React Native para iOS..." -ForegroundColor Green
Write-Host ""

# Navegar para o diretório frontend
Write-Host "1. Navegando para o diretório frontend..." -ForegroundColor Yellow
Set-Location "frontend"

# Limpar cache do npm
Write-Host "2. Limpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force

# Remover node_modules
Write-Host "3. Removendo node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

# Remover package-lock.json
Write-Host "4. Removendo package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

# Reinstalar dependências
Write-Host "5. Reinstalando dependências..." -ForegroundColor Yellow
npm install

# Limpar cache do Expo
Write-Host "6. Limpando cache do Expo..." -ForegroundColor Yellow
npx expo start --clear

Write-Host ""
Write-Host "Processo concluído! Agora teste no iOS." -ForegroundColor Green
Read-Host "Pressione Enter para continuar"
