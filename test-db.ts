import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function test() {
  try {
    const result = await client`SELECT 1 as test`;
    console.log('✅ Conexão OK:', result);
  } catch (error: any) {
    console.log('❌ Erro:', error.message);
  }
  process.exit(0);
}

test();
