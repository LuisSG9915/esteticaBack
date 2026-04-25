import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_clientes } from "../catalogos/clientes";
import { cat_nomina_trabajadores } from "../catalogos/trabajadores";
import { agenda_citas } from "./citas";
import { sql } from "drizzle-orm";

export const agenda_notificaciones = sqliteTable("agenda_notificaciones", {
  id: int().primaryKey({ autoIncrement: true }),
  idCita: int().references(() => agenda_citas.id),
  idCliente: int().references(() => cat_clientes.id),

  tipo: text().$type<"RECORDATORIO_CITA" | "CONFIRMACION" | "CANCELACION" | "PROMOCION" | "CUMPLEANOS">().notNull(),
  canal: text().$type<"WHATSAPP" | "SMS" | "EMAIL" | "LLAMADA">().notNull(),

  contenido: text(), // mensaje enviado
  telefonoDestino: text(),
  emailDestino: text(),

  // Programación
  fechaEnvioProgramado: text().notNull(),
  fechaEnvioReal: text(), // null si no se ha enviado

  // Estado
  estatus: text().$type<"PENDIENTE" | "ENVIADA" | "FALLIDA" | "CANCELADA">().default("PENDIENTE"),
  error: text(), // si falló, el mensaje de error

  // Respuesta del cliente (para confirmaciones)
  respuestaRecibida: text(), // SI, NO, etc.
  fechaRespuesta: text(),

  // Quién creó la notificación
  idUsuarioCreador: int().references(() => cat_nomina_trabajadores.id),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  usuarioEjecuta: int(),
});
