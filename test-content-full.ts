import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function test() {
  try {
    const content = await client`SELECT * FROM "Content" LIMIT 1`;
    console.log('Colunas disponíveis:', Object.keys(content[0]));
    console.log('\nConteúdo completo:', JSON.stringify(content[0], null, 2));
  } catch (error: any) {
    console.log('❌ Erro:', error.message);
  }
  process.exit(0);
}

test();
