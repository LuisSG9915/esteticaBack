import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { cat_clientes } from "../catalogos/clientes";
import { cat_sucursales } from "../catalogos/sucursales";
import { cat_descuentos } from "../catalogos/descuentos";
import { cat_nomina_trabajadores } from "../catalogos/trabajadores";
import { cat_medios_pagos } from "../catalogos/medios_pagos";
import { cat_productos } from "../catalogos/productos";
import { sql } from "drizzle-orm";

export const ventas = sqliteTable("ventas", {
  id: int().primaryKey({ autoIncrement: true }),
  idSucursal: int().references(() => cat_sucursales.id),
  idCliente: int().references(() => cat_clientes.id),
  idDescuento: int().references(() => cat_descuentos.id),
  idTrabajador: int().references(() => cat_nomina_trabajadores.id), // quien cobró
  idProducto: int().references(() => cat_productos.id),
  fecha: text().default(sql`(CURRENT_TIMESTAMP)`),
  no_venta: int().notNull(),
  cant_producto: real().notNull(),
  precio: real().notNull(),
  descuento: real().notNull(),
  tasaIva: real().notNull(),
  status: text().$type<"PROCESO" | "FINALIZADA" | "CANCELADA">().default("PROCESO"),
  observacion: text(),
  corte: int(),
  corteParcial: int(),
  usuarioEjecuta: int(),
});

export const ventas_medios_pagos = sqliteTable("ventas_medios_pagos", {
  id: int().primaryKey({ autoIncrement: true }),
  idVenta: int().references(() => ventas.id),
  idMedioPago: int().references(() => cat_medios_pagos.id),
  importe: real().notNull(),
  corte: int(),
  corteParcial: int(),
  referencia: text(),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),

  idTrabajador: int()
    .notNull()
    .references(() => cat_nomina_trabajadores.id),
});
