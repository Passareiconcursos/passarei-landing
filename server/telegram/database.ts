import { db } from "../../db";
import { sql } from "drizzle-orm";

export async function getRandomContent(examType: string) {
  try {
    const result = await db.execute(sql`
      SELECT * FROM ai_generated_content
      WHERE exam_type = ${examType}
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log(`⚠️  Nenhum conteúdo para ${examType}, retornando qualquer um`);
      
      const fallback = await db.execute(sql`
        SELECT * FROM ai_generated_content
        ORDER BY RANDOM()
        LIMIT 1
      `);
      
      return fallback.rows[0] || null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdo:', error);
    return null;
  }
}

export async function createOrGetUser(telegramId: string, name: string) {
  try {
    const existing = await db.execute(sql`
      SELECT * FROM users WHERE telegram_id = ${telegramId}
    `);

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await db.execute(sql`
      INSERT INTO users (
        email, 
        name, 
        phone, 
        exam_type, 
        state, 
        telegram_id,
        onboarding_completed
      ) VALUES (
        ${telegramId + '@telegram.temp'},
        ${name},
        'telegram',
        'PF',
        'FEDERAL',
        ${telegramId},
        false
      )
      RETURNING *
    `);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    return null;
  }
}

export async function checkUserLimit(telegramId: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT daily_content_count, last_content_date, plan
      FROM users
      WHERE telegram_id = ${telegramId}
    `);

    if (result.rows.length === 0) return false;

    const user = result.rows[0] as any;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.last_content_date 
      ? new Date(user.last_content_date).toISOString().split('T')[0]
      : null;

    // Reset contador se é um novo dia
    if (lastDate !== today) {
      await db.execute(sql`
        UPDATE users 
        SET daily_content_count = 0, last_content_date = ${today}
        WHERE telegram_id = ${telegramId}
      `);
      return true;
    }

    // Verificar limite
    const limit = user.plan === 'FREE' ? 10 : 9999;
    return user.daily_content_count < limit;
  } catch (error) {
    console.error('❌ Erro ao verificar limite:', error);
    return true; // Em caso de erro, permite
  }
}

export async function incrementUserCount(telegramId: string) {
  try {
    await db.execute(sql`
      UPDATE users 
      SET daily_content_count = daily_content_count + 1,
          last_content_date = CURRENT_DATE
      WHERE telegram_id = ${telegramId}
    `);
  } catch (error) {
    console.error('❌ Erro ao incrementar contador:', error);
  }
}
