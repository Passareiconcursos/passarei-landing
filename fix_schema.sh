#!/bin/bash

# Fazer backup
cp prisma/schema.prisma prisma/schema.prisma.backup

# Substituir datasource para usar env vars
sed -i '0,/datasource db {/,/}/c\
datasource db {\
  provider  = "postgresql"\
  url       = env("DATABASE_URL")\
  directUrl = env("DIRECT_URL")\
}' prisma/schema.prisma

echo "✅ Schema corrigido!"
echo ""
echo "📄 Novo datasource:"
grep -A 5 "datasource db" prisma/schema.prisma
