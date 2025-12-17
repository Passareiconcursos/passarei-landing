import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function test() {
  try {
    const result = await client`SELECT * FROM "User" LIMIT 1`;
    console.log('Tipo do resultado:', typeof result);
    console.log('É array?:', Array.isArray(result));
    console.log('Resultado:', result);
    console.log('Length:', result.length);
  } catch (error: any) {
    console.log('❌ Erro:', error.message);
  }
  process.exit(0);
}

test();
