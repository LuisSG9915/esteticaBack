import { relations } from "drizzle-orm";
import { cat_sucursales } from "./catalogos/sucursales";
import { cat_clientes } from "./catalogos/clientes";
import { cat_ficha_cliente } from "./catalogos/ficha_cliente";
import { cat_nomina_trabajadores } from "./catalogos/trabajadores";
import { cat_productos } from "./catalogos/productos";
import { cat_marcas } from "./catalogos/marcas";
import { cat_deptos } from "./catalogos/deptos";
import { cat_clases } from "./catalogos/clases";
import { cat_areas } from "./catalogos/areas";
import { cat_nomina_estatus } from "./catalogos/nomina_estatus";
import { cat_nomina_puestos } from "./catalogos/nomina_puestos";
import { cat_nomina_motivos_bajas } from "./catalogos/motivos_bajas";
import { cat_perfiles } from "./seguridad/perfiles";
import { cat_modulos } from "./seguridad/modulos";
import { permisos } from "./seguridad/permisos";
import { cat_medios_pagos } from "./catalogos/medios_pagos";
import { cat_descuentos } from "./catalogos/descuentos";
import { cat_almacenes } from "./catalogos/almacenes";
import { cat_tipo_movto } from "./catalogos/tipo_movtos";
import { ventas, ventas_medios_pagos } from "./ventas/ventas";
import { inventario } from "./inventario/inventario";
import { nomina_comisiones } from "./nomina/comisiones";
import { agenda_citas } from "./agenda/citas";
import { agenda_notificaciones } from "./agenda/notificaciones";

// ─── Sucursales ─────────────────────────────────────────────────────────────
export const sucursalesRelations = relations(cat_sucursales, ({ many }) => ({
  clientes: many(cat_clientes),
  trabajadores: many(cat_nomina_trabajadores),
  ventas: many(ventas),
  citas: many(agenda_citas),
  almacenes: many(cat_almacenes),
  descuentos: many(cat_descuentos),
  inventario: many(inventario),
}));

// ─── Clientes ───────────────────────────────────────────────────────────────
export const clientesRelations = relations(cat_clientes, ({ one, many }) => ({
  sucursal: one(cat_sucursales, {
    fields: [cat_clientes.sucursal_origen],
    references: [cat_sucursales.id],
  }),
  ficha: one(cat_ficha_cliente),
  citas: many(agenda_citas),
  ventas: many(ventas),
  notificaciones: many(agenda_notificaciones),
}));

// ─── Ficha Cliente ──────────────────────────────────────────────────────────
export const fichaClienteRelations = relations(
  cat_ficha_cliente,
  ({ one }) => ({
    cliente: one(cat_clientes, {
      fields: [cat_ficha_cliente.idCliente],
      references: [cat_clientes.id],
    }),
  }),
);

// ─── Trabajadores ───────────────────────────────────────────────────────────
export const trabajadoresRelations = relations(
  cat_nomina_trabajadores,
  ({ one, many }) => ({
    sucursal: one(cat_sucursales, {
      fields: [cat_nomina_trabajadores.idSucursal],
      references: [cat_sucursales.id],
    }),
    estatus: one(cat_nomina_estatus, {
      fields: [cat_nomina_trabajadores.idEstatus],
      references: [cat_nomina_estatus.id],
    }),
    puesto: one(cat_nomina_puestos, {
      fields: [cat_nomina_trabajadores.idPuesto],
      references: [cat_nomina_puestos.id],
    }),
    perfil: one(cat_perfiles, {
      fields: [cat_nomina_trabajadores.idPerfil],
      references: [cat_perfiles.id],
    }),
    motivoBaja: one(cat_nomina_motivos_bajas, {
      fields: [cat_nomina_trabajadores.idMotivoBaja],
      references: [cat_nomina_motivos_bajas.id],
    }),
    ventas: many(ventas),
    comisiones: many(nomina_comisiones),
    citasAtendidas: many(agenda_citas, { relationName: "citaTrabajador" }),
    citasCreadas: many(agenda_citas, { relationName: "citaCreador" }),
  }),
);

// ─── Productos ──────────────────────────────────────────────────────────────
export const productosRelations = relations(
  cat_productos,
  ({ one, many }) => ({
    marca: one(cat_marcas, {
      fields: [cat_productos.idMarca],
      references: [cat_marcas.id],
    }),
    area: one(cat_areas, {
      fields: [cat_productos.idArea],
      references: [cat_areas.id],
    }),
    depto: one(cat_deptos, {
      fields: [cat_productos.idDepto],
      references: [cat_deptos.id],
    }),
    clase: one(cat_clases, {
      fields: [cat_productos.idClase],
      references: [cat_clases.id],
    }),
    ventas: many(ventas),
    citas: many(agenda_citas),
    comisiones: many(nomina_comisiones),
    inventario: many(inventario),
  }),
);

// ─── Marcas ─────────────────────────────────────────────────────────────────
export const marcasRelations = relations(cat_marcas, ({ many }) => ({
  productos: many(cat_productos),
}));

// ─── Departamentos ──────────────────────────────────────────────────────────
export const deptosRelations = relations(cat_deptos, ({ many }) => ({
  productos: many(cat_productos),
}));

// ─── Clases ─────────────────────────────────────────────────────────────────
export const clasesRelations = relations(cat_clases, ({ many }) => ({
  productos: many(cat_productos),
}));

// ─── Áreas ──────────────────────────────────────────────────────────────────
export const areasRelations = relations(cat_areas, ({ many }) => ({
  productos: many(cat_productos),
}));

// ─── Descuentos ─────────────────────────────────────────────────────────────
export const descuentosRelations = relations(cat_descuentos, ({ one }) => ({
  sucursal: one(cat_sucursales, {
    fields: [cat_descuentos.idSucursal],
    references: [cat_sucursales.id],
  }),
}));

// ─── Almacenes ──────────────────────────────────────────────────────────────
export const almacenesRelations = relations(cat_almacenes, ({ one }) => ({
  sucursal: one(cat_sucursales, {
    fields: [cat_almacenes.sucursal],
    references: [cat_sucursales.id],
  }),
}));

// ─── Perfiles ───────────────────────────────────────────────────────────────
export const perfilesRelations = relations(cat_perfiles, ({ many }) => ({
  permisos: many(permisos),
  trabajadores: many(cat_nomina_trabajadores),
}));

// ─── Módulos ────────────────────────────────────────────────────────────────
export const modulosRelations = relations(cat_modulos, ({ many }) => ({
  permisos: many(permisos),
}));

// ─── Permisos ───────────────────────────────────────────────────────────────
export const permisosRelations = relations(permisos, ({ one }) => ({
  perfil: one(cat_perfiles, {
    fields: [permisos.idPerfil],
    references: [cat_perfiles.id],
  }),
  modulo: one(cat_modulos, {
    fields: [permisos.idModulo],
    references: [cat_modulos.id],
  }),
}));

// ─── Medios de Pago ─────────────────────────────────────────────────────────
export const mediosPagosRelations = relations(cat_medios_pagos, ({ many }) => ({
  ventasMediosPagos: many(ventas_medios_pagos),
}));

// ─── Tipo Movimientos ───────────────────────────────────────────────────────
export const tipoMovtosRelations = relations(cat_tipo_movto, ({ many }) => ({
  inventario: many(inventario),
}));

// ─── Estatus Nómina ─────────────────────────────────────────────────────────
export const nominaEstatusRelations = relations(
  cat_nomina_estatus,
  ({ many }) => ({
    trabajadores: many(cat_nomina_trabajadores),
  }),
);

// ─── Puestos Nómina ─────────────────────────────────────────────────────────
export const nominaPuestosRelations = relations(
  cat_nomina_puestos,
  ({ many }) => ({
    trabajadores: many(cat_nomina_trabajadores),
  }),
);

// ─── Motivos Bajas ──────────────────────────────────────────────────────────
export const motivosBajasRelations = relations(
  cat_nomina_motivos_bajas,
  ({ many }) => ({
    trabajadores: many(cat_nomina_trabajadores),
  }),
);

// ─── Ventas ─────────────────────────────────────────────────────────────────
export const ventasRelations = relations(ventas, ({ one, many }) => ({
  sucursal: one(cat_sucursales, {
    fields: [ventas.idSucursal],
    references: [cat_sucursales.id],
  }),
  cliente: one(cat_clientes, {
    fields: [ventas.idCliente],
    references: [cat_clientes.id],
  }),
  descuento: one(cat_descuentos, {
    fields: [ventas.idDescuento],
    references: [cat_descuentos.id],
  }),
  trabajador: one(cat_nomina_trabajadores, {
    fields: [ventas.idTrabajador],
    references: [cat_nomina_trabajadores.id],
  }),
  producto: one(cat_productos, {
    fields: [ventas.idProducto],
    references: [cat_productos.id],
  }),
  mediosPago: many(ventas_medios_pagos),
  comisiones: many(nomina_comisiones),
}));

// ─── Ventas Medios de Pago ──────────────────────────────────────────────────
export const ventasMediosPagosRelations = relations(
  ventas_medios_pagos,
  ({ one }) => ({
    venta: one(ventas, {
      fields: [ventas_medios_pagos.idVenta],
      references: [ventas.id],
    }),
    medioPago: one(cat_medios_pagos, {
      fields: [ventas_medios_pagos.idMedioPago],
      references: [cat_medios_pagos.id],
    }),
    trabajador: one(cat_nomina_trabajadores, {
      fields: [ventas_medios_pagos.idTrabajador],
      references: [cat_nomina_trabajadores.id],
    }),
  }),
);

// ─── Inventario ─────────────────────────────────────────────────────────────
export const inventarioRelations = relations(inventario, ({ one }) => ({
  sucursal: one(cat_sucursales, {
    fields: [inventario.idSucursal],
    references: [cat_sucursales.id],
  }),
  almacen: one(cat_almacenes, {
    fields: [inventario.idAlmacen],
    references: [cat_almacenes.id],
  }),
  producto: one(cat_productos, {
    fields: [inventario.idProducto],
    references: [cat_productos.id],
  }),
  tipoMovto: one(cat_tipo_movto, {
    fields: [inventario.tipoMovto],
    references: [cat_tipo_movto.id],
  }),
}));

// ─── Comisiones ─────────────────────────────────────────────────────────────
export const comisionesRelations = relations(
  nomina_comisiones,
  ({ one }) => ({
    trabajador: one(cat_nomina_trabajadores, {
      fields: [nomina_comisiones.idTrabajador],
      references: [cat_nomina_trabajadores.id],
    }),
    venta: one(ventas, {
      fields: [nomina_comisiones.idVenta],
      references: [ventas.id],
    }),
    servicio: one(cat_productos, {
      fields: [nomina_comisiones.idServicio],
      references: [cat_productos.id],
    }),
  }),
);

// ─── Citas ──────────────────────────────────────────────────────────────────
export const citasRelations = relations(agenda_citas, ({ one, many }) => ({
  sucursal: one(cat_sucursales, {
    fields: [agenda_citas.idSucursal],
    references: [cat_sucursales.id],
  }),
  cliente: one(cat_clientes, {
    fields: [agenda_citas.idCliente],
    references: [cat_clientes.id],
  }),
  servicio: one(cat_productos, {
    fields: [agenda_citas.idServicio],
    references: [cat_productos.id],
  }),
  trabajador: one(cat_nomina_trabajadores, {
    fields: [agenda_citas.idTrabajador],
    references: [cat_nomina_trabajadores.id],
    relationName: "citaTrabajador",
  }),
  usuarioCreador: one(cat_nomina_trabajadores, {
    fields: [agenda_citas.idUsuarioCreador],
    references: [cat_nomina_trabajadores.id],
    relationName: "citaCreador",
  }),
  notificaciones: many(agenda_notificaciones),
}));

// ─── Notificaciones ─────────────────────────────────────────────────────────
export const notificacionesRelations = relations(
  agenda_notificaciones,
  ({ one }) => ({
    cita: one(agenda_citas, {
      fields: [agenda_notificaciones.idCita],
      references: [agenda_citas.id],
    }),
    cliente: one(cat_clientes, {
      fields: [agenda_notificaciones.idCliente],
      references: [cat_clientes.id],
    }),
    usuarioCreador: one(cat_nomina_trabajadores, {
      fields: [agenda_notificaciones.idUsuarioCreador],
      references: [cat_nomina_trabajadores.id],
    }),
  }),
);
