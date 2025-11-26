import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./server/routes";
import { registerAIRoutes } from "./server/ai-routes";
import { registerEditalRoutes } from "./server/edital-routes";
import { registerPrismaRoutes } from "./server/routes-prisma";
import { registerSupabaseRoutes } from "./server/routes-supabase";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('🚀 Servidor v2 - SEM Vite, SEM Telegram');

(async () => {
  const server = await registerRoutes(app);
  
  console.log('✅ registerRoutes concluído');
  
  registerAIRoutes(app);
  console.log('✅ registerAIRoutes concluído');
  
  registerPrismaRoutes(app);
  console.log('✅ registerPrismaRoutes concluído');
  
  registerSupabaseRoutes(app);
  console.log('✅ registerSupabaseRoutes concluído');
  
  registerEditalRoutes(app);
  console.log('✅ registerEditalRoutes concluído');

  const port = 5000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
  });
})();
