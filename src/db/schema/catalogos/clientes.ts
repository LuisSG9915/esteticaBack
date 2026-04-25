import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_sucursales } from "./sucursales";

export const cat_clientes = sqliteTable("cat_clientes", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  apellidoPaterno: text(),
  apellidoMaterno: text(),
  domicilio: text(),
  calle: text(),
  numero: text(),
  colonia: text(),
  ciudad: text(),
  estado: text(),
  telefono: text(),
  email: text(),
  sucursal_origen: int().references(() => cat_sucursales.id),
  fechaRegistro: text().default("CURRENT_TIMESTAMP"),
  fechaNacimeinto: text(),
  tipoCliente: text().$type<"NORMAL" | "VIP">().default("NORMAL"),
  notasInternas: text(),
  ultimaVisita: text(),
  usuarioEjecuta: int(),
});
