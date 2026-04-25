import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_clientes } from "./clientes";
import { sql } from "drizzle-orm";

export const cat_ficha_cliente = sqliteTable("cat_ficha_cliente", {
  id: int().primaryKey({ autoIncrement: true }),
  idCliente: int().references(() => cat_clientes.id),

  // Alergias y contraindicaciones
  alergiaNickel: int().default(0), // 1 = sí, 0 = no
  alergiaLatex: int().default(0),
  alergiaPerfumes: int().default(0),
  alergiaCosmeticos: int().default(0),
  alergiaMedicamentos: text(), // especificar cuáles
  alergiaOtros: text(),

  // Condiciones médicas
  embarazo: int().default(0),
  lactancia: int().default(0),
  diabetes: int().default(0),
  hipertension: int().default(0),
  problemasCirculatorios: int().default(0),
  problemasCardiacos: int().default(0),
  tratamientoMedico: int().default(0),
  medicamentosActuales: text(),
  cirugiasRecientes: text(), // fecha y tipo de cirugía
  condicionesPiel: text(), // rosácea, acne, sensibilidad, etc.

  // Preferencias de servicio
  preferenciaProductos: text(), // marcas o ingredientes preferidos
  productosNoDeseados: text(), // ingredientes que no quiere
  preferenciaTrabajador: int(), // id del trabajador favorito

  // Consentimientos
  aceptaTratamientos: int().default(0), // firmó consentimiento informado
  fechaAceptacion: text(),

  notasTecnicas: text(), // observaciones para esteticistas
  fechaRegistro: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
