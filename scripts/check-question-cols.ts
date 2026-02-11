import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Question'
    ORDER BY ordinal_position
  `) as any[];
  for (const c of cols) console.log(c.column_name);
  process.exit(0);
}
main();
