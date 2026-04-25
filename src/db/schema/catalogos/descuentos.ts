import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { cat_sucursales } from "./sucursales";

export const cat_descuentos = sqliteTable("cat_descuentos", {
  id: int().primaryKey({ autoIncrement: true }),
  idSucursal: int().references(() => cat_sucursales.id),
  nombre: text().notNull(),
  porcentaje: real().notNull(),
  status: text().$type<"ACTIVO" | "INACTIVO">().default("ACTIVO"),
  usuarioEjecuta: int(),
});
