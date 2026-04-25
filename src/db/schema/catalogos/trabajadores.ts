import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { cat_sucursales } from "./sucursales";
import { cat_nomina_estatus } from "./nomina_estatus";
import { cat_nomina_puestos } from "./nomina_puestos";
import { cat_nomina_motivos_bajas } from "./motivos_bajas";
import { cat_perfiles } from "../seguridad/perfiles";

export const cat_nomina_trabajadores = sqliteTable("cat_nomina_trabajadores", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  apellidoPaterno: text(),
  apellidoMaterno: text(),
  rfc: text(),
  curp: text(),
  idSucursal: int().references(() => cat_sucursales.id),
  idEstatus: int().references(() => cat_nomina_estatus.id),
  idPuesto: int().references(() => cat_nomina_puestos.id),
  idPerfil: int().references(() => cat_perfiles.id), // perfil de seguridad
  sexo: text(),
  username: text().notNull().unique(),
  password_hash: text().notNull(),
  idMotivoBaja: int().references(() => cat_nomina_motivos_bajas.id),
  comisionPorcentaje: real(),
  fechaIngreso: text(),
  fechaBaja: text(),
  telefono: text(),
  email: text(),
  usuarioEjecuta: int(),
});
