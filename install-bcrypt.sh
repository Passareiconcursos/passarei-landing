#!/bin/bash

echo "📦 Instalando bcrypt com --legacy-peer-deps..."
npm install --legacy-peer-deps bcrypt

if [ $? -eq 0 ]; then
    echo "✅ bcrypt instalado com sucesso!"
    echo ""
    echo "🌱 Você pode agora rodar o seed com:"
    echo "   npx prisma db seed"
else
    echo "❌ Erro na instalação"
    exit 1
fi
