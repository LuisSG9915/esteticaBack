import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_marcas } from "./marcas";
import { cat_clases } from "./clases";
import { cat_deptos } from "./deptos";
import { cat_areas } from "./areas";
import { sql } from "drizzle-orm";

export const cat_productos = sqliteTable("cat_productos", {
  id: int().primaryKey({ autoIncrement: true }),
  claveProd: text().notNull(),
  nombre: text().notNull(),
  nombreCorto: text(),
  sucursalOrigen: int(),
  idMarca: int().references(() => cat_marcas.id),
  idArea: int().references(() => cat_areas.id),
  idDepto: int().references(() => cat_deptos.id),
  idClase: int().references(() => cat_clases.id),
  inventariable: int().default(0),
  excento: int().default(0),
  obsoleto: int().default(0),
  esKit: int().default(0),
  esInsumo: int().default(0),
  esProducto: int().default(0),
  esServicio: int().default(0),
  tiempoEstimado: int().default(0),
  comision: real().default(0),
  tasaIva: real().default(0),
  costo: real().default(0),
  precio: real().notNull(),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
