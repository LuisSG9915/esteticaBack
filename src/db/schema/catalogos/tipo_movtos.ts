import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const cat_tipo_movto = sqliteTable("cat_tipo_movto", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  fechaCreacion: text().notNull(),
  usuarioEjecuta: int(),
});
