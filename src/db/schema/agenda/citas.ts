import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cat_clientes } from "../catalogos/clientes";
import { cat_productos } from "../catalogos/productos";
import { cat_nomina_trabajadores } from "../catalogos/trabajadores";
import { cat_sucursales } from "../catalogos/sucursales";
import { sql } from "drizzle-orm";

export const agenda_citas = sqliteTable("agenda_citas", {
  id: int().primaryKey({ autoIncrement: true }),
  idSucursal: int().references(() => cat_sucursales.id),
  idCliente: int().references(() => cat_clientes.id),
  idServicio: int().references(() => cat_productos.id), // productos que son servicios
  idTrabajador: int().references(() => cat_nomina_trabajadores.id), // quién atiende

  fecha: text().notNull(), // YYYY-MM-DD
  horaInicio: text().notNull(), // HH:MM
  horaFin: text(), // calculado según duración del servicio
  duracionMinutos: int().notNull(),

  estatus: text()
    .$type<"PENDIENTE" | "CONFIRMADA" | "ENCURSO" | "COMPLETADA" | "CANCELADA" | "NOASISTIO">()
    .default("PENDIENTE"),

  // Origen de la cita
  origen: text().$type<"PRESENCIAL" | "TELEFONO" | "WHATSAPP" | "ONLINE">().default("PRESENCIAL"),

  // Notas
  notasCliente: text(), // que pidió la clienta
  notasInternas: text(), // para el personal

  // Precio (puede diferir del catálogo)
  precioServicio: int(), // precio acordado

  // Quien creó/modificó
  idUsuarioCreador: int().references(() => cat_nomina_trabajadores.id),
  fechaCreacion: text().default(sql`(CURRENT_TIMESTAMP)`),
  fechaModificacion: text(),

  // Si se convierte en venta
  idVenta: int(), // referencia opcional a ventas (si ya se facturó)
  usuarioEjecuta: int(),
});
