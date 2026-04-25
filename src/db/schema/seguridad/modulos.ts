import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cat_modulos = sqliteTable("cat_modulos", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(), // ventas, agenda, clientes, productos, reportes, nomina
  descripcion: text(),
  ruta: text(), // /ventas, /agenda, etc.
  icono: text(),
  orden: int().default(0),
  activo: int().default(1),
  usuarioEjecuta: int(),
});
