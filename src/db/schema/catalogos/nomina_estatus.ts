import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_nomina_estatus = sqliteTable("cat_nomina_estatus", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  usuarioEjecuta: int(),
});
