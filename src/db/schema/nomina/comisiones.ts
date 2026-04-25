import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_nomina_trabajadores } from "../catalogos/trabajadores";
import { cat_productos } from "../catalogos/productos";
import { ventas } from "../ventas/ventas";
import { sql } from "drizzle-orm";

export const nomina_comisiones = sqliteTable("nomina_comisiones", {
  id: int().primaryKey({ autoIncrement: true }),
  idTrabajador: int().references(() => cat_nomina_trabajadores.id),
  idVenta: int().references(() => ventas.id),
  idServicio: int().references(() => cat_productos.id), // servicio realizado

  tipoComision: text().$type<"PORCENTAJE" | "FIJA">().default("PORCENTAJE"),
  porcentaje: real(), // si es porcentaje (ej: 10%)
  montoFijo: real(), // si es monto fijo (ej: $50)
  montoComision: real().notNull(), // monto final calculado

  // Estado del pago
  estatus: text().$type<"PENDIENTE" | "PAGADA" | "CANCELADA">().default("PENDIENTE"),
  fechaPago: text(),

  fechaRegistro: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
