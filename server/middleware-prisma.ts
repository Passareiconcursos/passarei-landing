import type { Request, Response, NextFunction } from "express";
import { verifyAdminSessionPrisma } from "./auth-prisma";

export async function requireAuthPrisma(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('🔍 [AUTH] Cookies recebidos:', req.cookies);
    
    const token = req.cookies?.adminToken;
    
    console.log('🔍 [AUTH] Token extraído:', token ? token.substring(0, 20) + '...' : 'NENHUM');

    if (!token) {
      console.log('❌ [AUTH] Sem token');
      return res.status(401).json({
        success: false,
        error: "Não autorizado. Faça login para continuar.",
      });
    }

    const admin = await verifyAdminSessionPrisma(token);
    
    console.log('🔍 [AUTH] Admin encontrado:', admin ? admin.email : 'NENHUM');

    if (!admin) {
      console.log('❌ [AUTH] Sessão inválida');
      return res.status(401).json({
        success: false,
        error: "Sessão inválida ou expirada. Faça login novamente.",
      });
    }

    console.log('✅ [AUTH] Autenticado:', admin.email);
    (req as any).admin = admin;
    next();
  } catch (error) {
    console.error("❌ [AUTH] Erro:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao verificar autenticação.",
    });
  }
}
