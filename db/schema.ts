import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

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
