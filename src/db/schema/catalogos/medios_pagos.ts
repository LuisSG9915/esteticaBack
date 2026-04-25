import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const cat_medios_pagos = sqliteTable("cat_medios_pagos", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(), // Efectivo, Tarjeta, Transferencia, etc.
  comisionPorcentaje: real().default(0),
  requiereReferencia: int().default(0), // 1 = sí, 0 = no
  activo: int().default(1),
  usuarioEjecuta: int(),
});
