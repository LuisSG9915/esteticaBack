import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const cat_clases = sqliteTable("cat_clases", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
