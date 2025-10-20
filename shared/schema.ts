import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const examTypeEnum = pgEnum("exam_type", ["PM", "PC", "PRF", "PF", "OUTRO"]);
export const leadStatusEnum = pgEnum("lead_status", ["NOVO", "CONTATADO", "QUALIFICADO", "CONVERTIDO"]);

// Lead table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(), // WhatsApp no formato (99) 99999-9999
  examType: examTypeEnum("exam_type").notNull(),
  state: varchar("state", { length: 2 }).notNull(), // UF do estado
  acceptedWhatsApp: boolean("accepted_whatsapp").notNull().default(true),
  status: leadStatusEnum("status").notNull().default("NOVO"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schema with validation
export const insertLeadSchema = createInsertSchema(leads, {
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "WhatsApp inválido. Use o formato (99) 99999-9999"),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]),
  state: z.string().length(2, "Estado inválido"),
  acceptedWhatsApp: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar receber conteúdo via WhatsApp",
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
