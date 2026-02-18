import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  registerDashboardRoutes,
  registerLeadsRoutes,
  registerUsersRoutes,
  registerSettingsRoutes,
  registerContentRoutes,
  registerSupportRoutes,
} from "./admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add cookie parsing middleware for admin routes
  app.use("/api/admin", (req, res, next) => {
    if (!req.cookies) {
      const cookieHeader = req.headers.cookie;
      if (cookieHeader) {
        req.cookies = cookieHeader.split(";").reduce(
          (cookies, cookie) => {
            const [name, value] = cookie.trim().split("=");
            cookies[name] = value;
            return cookies;
          },
          {} as Record<string, string>,
        );
      } else {
        req.cookies = {};
      }
    }
    next();
  });

  // Auth routes (login, logout, me) are in routes-supabase.ts (Supabase HTTP auth)

  // Admin sub-routers
  registerDashboardRoutes(app);
  registerLeadsRoutes(app);
  registerUsersRoutes(app);
  registerSettingsRoutes(app);
  registerContentRoutes(app);
  registerSupportRoutes(app);

  // Promo codes routes (GET/POST/PATCH /api/admin/promo-codes) are in promo-routes.ts

  // ============================================
  // WEBHOOK WHATSAPP
  // ============================================
  const { handleIncomingWhatsApp } = await import("./whatsapp/webhook");
  // GET para verificação do Twilio
  app.get("/webhook/whatsapp", (req, res) => {
    res.type("text/xml");
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  });
  app.post("/webhook/whatsapp", handleIncomingWhatsApp);

  const httpServer = createServer(app);
  return httpServer;
}
