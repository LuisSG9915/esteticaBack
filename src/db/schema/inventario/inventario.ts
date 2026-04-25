import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_productos } from "../catalogos/productos";
import { cat_sucursales } from "../catalogos/sucursales";
import { cat_tipo_movto } from "../catalogos/tipo_movtos";
import { cat_almacenes } from "../catalogos/almacenes";

export const inventario = sqliteTable("inventario", {
  id: int().primaryKey({ autoIncrement: true }),
  idSucursal: int().references(() => cat_sucursales.id),
  idAlmacen: int().references(() => cat_almacenes.id),
  idProducto: int().references(() => cat_productos.id),
  tipoMovto: int().references(() => cat_tipo_movto.id),
  cantidadEntrada: real().notNull(),
  cantidadSalida: real().notNull(),
  usuario: int().notNull(),
  folio: text().notNull(),
  fecha: text().notNull(),
  usuarioEjecuta: int(),
});
