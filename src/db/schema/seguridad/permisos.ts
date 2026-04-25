import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { cat_perfiles } from "./perfiles";
import { cat_modulos } from "./modulos";

export const permisos = sqliteTable("permisos", {
  id: int().primaryKey({ autoIncrement: true }),
  idPerfil: int().references(() => cat_perfiles.id),
  idModulo: int().references(() => cat_modulos.id),
  puedeVer: int().default(0), // 1 = sí, 0 = no
  puedeCrear: int().default(0), // 1 = sí, 0 = no
  puedeEditar: int().default(0), // 1 = sí, 0 = no
  puedeEliminar: int().default(0), // 1 = sí, 0 = no
  usuarioEjecuta: int(),
});
