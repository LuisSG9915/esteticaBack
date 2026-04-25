import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_perfiles = sqliteTable("cat_perfiles", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(), // Admin, Recepcionista, Esteticista, Cajero
  descripcion: text(),
  activo: int().default(1),
  usuarioEjecuta: int(),
});
