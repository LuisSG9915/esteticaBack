import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_sucursales } from "./sucursales";

export const cat_almacenes = sqliteTable("cat_almacenes", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  sucursal: int().references(() => cat_sucursales.id),
  almacen: int(),
  fechaCreacion: text().notNull(),
  usuarioEjecuta: int(),
});
