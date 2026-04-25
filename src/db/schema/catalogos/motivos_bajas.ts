import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_nomina_motivos_bajas = sqliteTable("cat_nomina_motivos_bajas", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
    usuarioEjecuta: int(),
  
});
