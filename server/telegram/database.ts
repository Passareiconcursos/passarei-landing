import { db } from "../../db";
import { content, users } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

export async function getRandomContent(examType?: string) {
  try {
    const query = examType 
      ? db.select().from(content).where(eq(content.examType, examType)).orderBy(sql`RANDOM()`).limit(1)
      : db.select().from(content).orderBy(sql`RANDOM()`).limit(1);
    const result = await query;
    return result[0] || null;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

export async function createOrGetUser(telegramId: string, name: string) {
  try {
    const existing = await db.execute(
      sql`SELECT * FROM users WHERE telegram_id = ${telegramId} LIMIT 1`
    );
    
    if (existing.rows[0]) return existing.rows[0];
    
    await db.execute(sql`
      INSERT INTO users (telegram_id, email, name, phone, exam_type, state, plan)
      VALUES (${telegramId}, ${telegramId + '@telegram.temp'}, ${name}, '0000000000', 'PF', 'SP', 'FREE')
    `);
    
    const [newUser] = await db.execute(
      sql`SELECT * FROM users WHERE telegram_id = ${telegramId} LIMIT 1`
    );
    
    return newUser.rows[0];
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

export async function checkUserLimit(telegramId: string): Promise<boolean> {
  try {
    const result = await db.execute(
      sql`SELECT plan, daily_content_count, last_content_date FROM users WHERE telegram_id = ${telegramId} LIMIT 1`
    );
    
    const user = result.rows[0];
    if (!user) return false;
    
    // VETERANO ou PRO = ilimitado
    if (user.plan === 'VETERANO' || user.plan === 'PRO') return true;
    
    const today = new Date().toISOString().split('T')[0];
    const userDate = user.last_content_date?.toString().split('T')[0];
    
    if (userDate !== today) {
      await db.execute(sql`
        UPDATE users 
        SET daily_content_count = 0, last_content_date = CURRENT_DATE 
        WHERE telegram_id = ${telegramId}
      `);
      return true;
    }
    
    return (user.daily_content_count || 0) < 3;
  } catch (error) {
    console.error('Erro limite:', error);
    return false;
  }
}

export async function incrementUserCount(telegramId: string) {
  try {
    await db.execute(sql`
      UPDATE users 
      SET daily_content_count = COALESCE(daily_content_count, 0) + 1, 
          last_content_date = CURRENT_DATE 
      WHERE telegram_id = ${telegramId}
    `);
  } catch (error) {
    console.error('Erro incremento:', error);
  }
}
