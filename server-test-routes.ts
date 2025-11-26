import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./server/routes";
import { registerSupabaseRoutes } from "./server/routes-supabase";

const app = express();
app.use(express.json());

console.log('🧪 Teste - registerRoutes + Supabase');

(async () => {
  const server = await registerRoutes(app);
  console.log('✅ registerRoutes concluído');
  
  registerSupabaseRoutes(app);
  console.log('✅ registerSupabaseRoutes concluído');

  const port = 5000;
  server.listen(port, () => {
    console.log(`✅ Servidor na porta ${port}`);
  });
})();
