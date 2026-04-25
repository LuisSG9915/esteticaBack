import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_sucursales = sqliteTable("cat_sucursales", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  direccion: text(),
  estatus: int().default(1), // 1 = Activa, 0 = Inactiva
});
