import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_sucursales } from "./sucursales";
import { sql } from "drizzle-orm";

export const cat_areas = sqliteTable("cat_areas", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
