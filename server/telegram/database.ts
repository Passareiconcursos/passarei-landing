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
    console.error('Erro ao buscar conteúdo:', error);
    return null;
  }
}

export async function createOrGetUser(telegramId: string, name: string) {
  try {
    const existing = await db.select().from(users)
      .where(eq(users.username, telegramId)).limit(1);
    
    if (existing[0]) return existing[0];
    
    const [newUser] = await db.insert(users).values({
      username: telegramId,
      email: `${telegramId}@telegram.temp`,
      password: 'telegram_user',
      role: 'user'
    }).returning();
    
    return newUser;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return null;
  }
}

export async function checkUserLimit(telegramId: string): Promise<boolean> {
  try {
    const [user] = await db.select().from(users)
      .where(eq(users.username, telegramId)).limit(1);
    
    if (!user) return false;
    
    // PRO = ilimitado
    if (user.plan === 'pro') return true;
    
    // FREE = 3/dia
    const today = new Date().toISOString().split('T')[0];
    const userDate = user.lastContentDate?.toISOString().split('T')[0];
    
    if (userDate !== today) {
      // Resetar contador
      await db.update(users)
        .set({ dailyContentCount: 0, lastContentDate: new Date() })
        .where(eq(users.username, telegramId));
      return true;
    }
    
    return (user.dailyContentCount || 0) < 3;
  } catch (error) {
    console.error('Erro ao verificar limite:', error);
    return false;
  }
}

export async function incrementUserCount(telegramId: string) {
  try {
    await db.execute(sql`
      UPDATE users 
      SET daily_content_count = COALESCE(daily_content_count, 0) + 1,
          last_content_date = CURRENT_DATE
      WHERE username = ${telegramId}
    `);
  } catch (error) {
    console.error('Erro ao incrementar:', error);
  }
}
