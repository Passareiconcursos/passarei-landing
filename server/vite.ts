import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Importação simplificada para evitar conflitos de cache do Replit
  const vite = await import("vite");
  const { nanoid } = await import("nanoid");

  // Captura as funções de qualquer lugar (default ou root)
  const createServer = vite.createServer || (vite as any).default?.createServer;
  const createLogger = vite.createLogger || (vite as any).default?.createLogger;

  // Se o ambiente estiver muito restrito, usamos o logger padrão do console
  const viteLogger =
    typeof createLogger === "function" ? createLogger() : console;

  const viteConfig = {
    plugins: [],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
      },
    },
  };

  // Se não conseguirmos criar o servidor Vite, o app não quebra, mas avisamos
  if (typeof createServer !== "function") {
    log(
      "Aviso: Ambiente de desenvolvimento limitado. Servindo arquivos estáticos.",
      "vite",
    );
    return;
  }

  const viteServer = await createServer({
    ...viteConfig,
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    customLogger: viteLogger as any,
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(viteServer.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    // Se não houver build, servimos a pasta public raiz como fallback
    app.use(express.static(path.resolve(process.cwd(), "public")));
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (req, res, next) => {
    const urlPath = req.originalUrl;
    if (urlPath.startsWith("/api") || urlPath.startsWith("/webhook"))
      return next();
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
