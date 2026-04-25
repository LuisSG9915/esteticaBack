import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_nomina_puestos = sqliteTable("cat_nomina_puestos", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
});
