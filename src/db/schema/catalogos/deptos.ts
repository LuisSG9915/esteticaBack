import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const cat_deptos = sqliteTable("cat_deptos", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
