import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import emailTestRouter from "./email/test-route";
import { registerRoutes } from "./routes";
import { registerAIRoutes } from "./ai-routes";
import activationRoutes from "./activation/test-routes";
import paymentRoutes from "./payment/routes";
import { registerEditalRoutes } from "./edital-routes";
// import { registerPrismaRoutes } from "./routes-prisma"; // DESABILITADO - usando Supabase
import { registerSupabaseRoutes } from "./routes-supabase";
import { registerMiniChatRoutes } from "./minichat-routes";
import paymentRoutes from "./payment/routes";
import { setupVite, serveStatic, log } from "./vite";
import { startTelegramBot } from "./telegram/bot";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/payment", paymentRoutes);
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
  // Inicializa o servidor e as rotas base
  const server = await registerRoutes(app);

  // Registra as funcionalidades do Passarei
  registerAIRoutes(app);
  registerSupabaseRoutes(app);
  registerEditalRoutes(app);
  registerMiniChatRoutes(app);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/email", emailTestRouter);

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
    },
  );
})();
