import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  cat_sucursales,
  cat_clientes,
  cat_ficha_cliente,
  cat_nomina_trabajadores,
  cat_productos,
  cat_descuentos,
  cat_almacenes,
  ventas,
  ventas_medios_pagos,
  inventario,
  nomina_comisiones,
  agenda_citas,
  agenda_notificaciones,
  cat_perfiles,
  cat_modulos,
  permisos,
} from "../db/schema";

// ─── Helper: omitir campo de auditoría en inserts ───────────────────────────
function insertSchema(table: Parameters<typeof createInsertSchema>[0]) {
  return createInsertSchema(table).omit({ usuarioEjecuta: true, id: true });
}

// ─── Sucursales ─────────────────────────────────────────────────────────────
export const insertSucursalSchema = insertSchema(cat_sucursales);

// ─── Clientes ───────────────────────────────────────────────────────────────
export const insertClienteSchema = createInsertSchema(cat_clientes, {
  email: z.string().email().optional().nullable(),
  telefono: z.string().min(10).optional().nullable(),
  tipoCliente: z.enum(["NORMAL", "VIP"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

export const updateClienteSchema = insertClienteSchema.partial();

// ─── Ficha Cliente ──────────────────────────────────────────────────────────
export const insertFichaClienteSchema = insertSchema(cat_ficha_cliente);

// ─── Trabajadores ───────────────────────────────────────────────────────────
export const insertTrabajadorSchema = createInsertSchema(cat_nomina_trabajadores, {
  email: z.string().email().optional().nullable(),
  telefono: z.string().min(10).optional().nullable(),
  username: z.string().min(3),
  password_hash: z.string().min(6),
}).omit({ usuarioEjecuta: true, id: true });

export const updateTrabajadorSchema = insertTrabajadorSchema.partial();

// ─── Productos ──────────────────────────────────────────────────────────────
export const insertProductoSchema = createInsertSchema(cat_productos, {
  claveProd: z.string().min(1),
  nombre: z.string().min(1),
  precio: z.number().positive(),
  costo: z.number().min(0).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

export const updateProductoSchema = insertProductoSchema.partial();

// ─── Descuentos ─────────────────────────────────────────────────────────────
export const insertDescuentoSchema = createInsertSchema(cat_descuentos, {
  nombre: z.string().min(1),
  porcentaje: z.number().min(0).max(100),
  status: z.enum(["ACTIVO", "INACTIVO"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

// ─── Almacenes ──────────────────────────────────────────────────────────────
export const insertAlmacenSchema = insertSchema(cat_almacenes);

// ─── Ventas ─────────────────────────────────────────────────────────────────
export const insertVentaSchema = createInsertSchema(ventas, {
  no_venta: z.number().int().positive(),
  cant_producto: z.number().positive(),
  precio: z.number().min(0),
  descuento: z.number().min(0),
  tasaIva: z.number().min(0),
  status: z.enum(["PROCESO", "FINALIZADA", "CANCELADA"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

export const updateVentaSchema = insertVentaSchema.partial();

// ─── Ventas Medios de Pago ──────────────────────────────────────────────────
export const insertVentaMedioPagoSchema = createInsertSchema(ventas_medios_pagos, {
  importe: z.number().positive(),
}).omit({ usuarioEjecuta: true, id: true });

// ─── Inventario ─────────────────────────────────────────────────────────────
export const insertInventarioSchema = createInsertSchema(inventario, {
  cantidadEntrada: z.number().min(0),
  cantidadSalida: z.number().min(0),
  folio: z.string().min(1),
}).omit({ usuarioEjecuta: true, id: true });

// ─── Comisiones ─────────────────────────────────────────────────────────────
export const insertComisionSchema = createInsertSchema(nomina_comisiones, {
  montoComision: z.number().positive(),
  tipoComision: z.enum(["PORCENTAJE", "FIJA"]).optional().nullable(),
  estatus: z.enum(["PENDIENTE", "PAGADA", "CANCELADA"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

// ─── Citas ──────────────────────────────────────────────────────────────────
export const insertCitaSchema = createInsertSchema(agenda_citas, {
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato: HH:MM"),
  duracionMinutos: z.number().int().positive(),
  estatus: z.enum(["PENDIENTE", "CONFIRMADA", "ENCURSO", "COMPLETADA", "CANCELADA", "NOASISTIO"]).optional().nullable(),
  origen: z.enum(["PRESENCIAL", "TELEFONO", "WHATSAPP", "ONLINE"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

export const updateCitaSchema = insertCitaSchema.partial();

// ─── Notificaciones ─────────────────────────────────────────────────────────
export const insertNotificacionSchema = createInsertSchema(agenda_notificaciones, {
  fechaEnvioProgramado: z.string().min(1),
  tipo: z.enum(["RECORDATORIO_CITA", "CONFIRMACION", "CANCELACION", "PROMOCION", "CUMPLEANOS"]),
  canal: z.enum(["WHATSAPP", "SMS", "EMAIL", "LLAMADA"]),
  estatus: z.enum(["PENDIENTE", "ENVIADA", "FALLIDA", "CANCELADA"]).optional().nullable(),
}).omit({ usuarioEjecuta: true, id: true });

// ─── Seguridad ──────────────────────────────────────────────────────────────
export const insertPerfilSchema = createInsertSchema(cat_perfiles, {
  nombre: z.string().min(1),
}).omit({ usuarioEjecuta: true, id: true });

export const insertModuloSchema = createInsertSchema(cat_modulos, {
  nombre: z.string().min(1),
}).omit({ usuarioEjecuta: true, id: true });

export const insertPermisoSchema = insertSchema(permisos);
