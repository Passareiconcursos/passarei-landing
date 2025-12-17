import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function test() {
  try {
    // Ver todos os conteúdos
    const all = await client`SELECT id, title, "isActive" FROM "Content"`;
    console.log('Total de conteúdos:', all.length);
    console.log('Conteúdos:', all);
    
    // Testar a query exata do código
    const active = await client`SELECT * FROM "Content" WHERE "isActive" = true ORDER BY RANDOM() LIMIT 1`;
    console.log('\nConteúdo ativo encontrado:', active.length > 0 ? active[0].title : 'NENHUM');
  } catch (error: any) {
    console.log('❌ Erro:', error.message);
  }
  process.exit(0);
}

test();
