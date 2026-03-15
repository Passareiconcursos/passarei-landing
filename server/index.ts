import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import emailTestRouter from "./email/test-route";
import { registerRoutes } from "./routes";
import { registerAIRoutes } from "./ai-routes";
import activationRoutes from "./activation/test-routes";
import paymentRoutes from "./payment/routes";
import refundRoutes from "./payment/refund-routes";
import { registerEditalRoutes } from "./edital-routes";

import { registerSupabaseRoutes } from "./routes-supabase";
import { registerMiniChatRoutes } from "./minichat-routes";
import { registerEssayRoutes } from "./essay-routes";
import { registerSimuladoRoutes } from "./simulado-routes";
import { registerConcursosRoutes } from "./concursos-routes";
import { registerPromoRoutes } from "./promo-routes";
import { registerSalaAuthRoutes } from "./sala-auth-routes";
import { registerSalaRoutes } from "./sala-routes";
import { setupVite, serveStatic, log } from "./vite";
import { startTelegramBot } from "./telegram/bot";
import { startEmailScheduler } from "./email/email-scheduler";
import { runAutoMigrations, seedConcursosData } from "../db/auto-migrate";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/activation", activationRoutes);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  // Auto-migração: cria tabelas/colunas faltantes
  await runAutoMigrations();

  // Inicializa o servidor e as rotas base
  console.log("🔧 [Startup] registerRoutes...");
  const server = await registerRoutes(app);
  console.log("🔧 [Startup] registerAIRoutes...");
  registerAIRoutes(app);
  console.log("🔧 [Startup] registerSupabaseRoutes...");
  registerSupabaseRoutes(app);
  console.log("🔧 [Startup] registerEditalRoutes...");
  registerEditalRoutes(app);
  console.log("🔧 [Startup] registerMiniChatRoutes...");
  registerMiniChatRoutes(app);
  console.log("🔧 [Startup] registerEssayRoutes...");
  registerEssayRoutes(app);
  console.log("🔧 [Startup] registerSimuladoRoutes...");
  registerSimuladoRoutes(app);
  console.log("🔧 [Startup] registerConcursosRoutes...");
  registerConcursosRoutes(app);
  console.log("🔧 [Startup] registerPromoRoutes...");
  registerPromoRoutes(app);
  console.log("🔧 [Startup] registerSalaAuthRoutes...");
  registerSalaAuthRoutes(app);
  console.log("🔧 [Startup] registerSalaRoutes...");
  registerSalaRoutes(app);
  console.log("🔧 [Startup] payment routes...");
  app.use("/api/payment", paymentRoutes);
  app.use("/api/admin/financial", refundRoutes);
  console.log("🔧 [Startup] todas as rotas registradas");

  // Test routes: só em desenvolvimento (não expor em produção)
  if (!process.env.RAILWAY_ENVIRONMENT) {
    app.use("/api/email", emailTestRouter);
  }

  // --- BLOCO DE SEO (A NOVIDADE) ---
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://www.passarei.com.br/sitemap.xml`);
  });

  app.get("/sitemap.xml", async (_req, res) => {
    res.set("Content-Type", "application/xml");
    const today = new Date().toISOString().split("T")[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.passarei.com.br/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    res.send(sitemap);
  });
  // --- FIM DO BLOCO DE SEO ---

  // Tratamento de erros (O "guarda-costas" do código)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Servir frontend
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  console.log("✅ Frontend habilitado");

  // Telegram Bot - só roda no Railway
  if (process.env.RAILWAY_ENVIRONMENT) {
    startTelegramBot().catch(console.error);
  }

  // Email Scheduler - drip campaign para leads (só em produção)
  if (process.env.RAILWAY_ENVIRONMENT) {
    startEmailScheduler();
  }

  // Content Worker - pré-popular Content + Questions para editais prioritários (só Railway)
  if (process.env.RAILWAY_ENVIRONMENT) {
    import("./services/content-worker")
      .then(m => m.startContentWorker())
      .catch((e: any) => console.error("❌ [ContentWorker] Erro no startup:", e?.message ?? e));
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  console.log("🚀 Tentando iniciar servidor na porta:", port);
  console.log("🚀 PORT do ambiente:", process.env.PORT);

  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
      // Timeout aumentado para suportar chamadas de IA (redação ~30-60s)
      server.timeout = 90_000;         // 90s por requisição
      server.keepAliveTimeout = 95_000; // deve ser maior que timeout
      // Seed de concursos em background — não bloqueia o startup
      seedConcursosData().catch((e) =>
        console.error("⚠️ [seedConcursos] Erro no seed em background:", e?.message ?? e)
      );
    },
  );
})().catch((err) => {
  console.error("❌ [FATAL] Erro crítico no startup do servidor:", err);
  process.exit(1);
});
