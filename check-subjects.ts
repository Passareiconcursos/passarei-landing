import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function check() {
  const subjects = await client`SELECT * FROM "Subject"`;
  console.log('Matérias no banco:', subjects.length);
  subjects.forEach(s => console.log(`- ${s.id}: ${s.name} (${s.category})`));
  process.exit(0);
}
check();
