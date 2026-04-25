// Catalogos base (sin dependencias)
export * from "./catalogos/sucursales";
export * from "./catalogos/nomina_estatus";
export * from "./catalogos/nomina_puestos";
export * from "./catalogos/motivos_bajas";
export * from "./catalogos/marcas";
export * from "./catalogos/deptos";
export * from "./catalogos/clases";
export * from "./catalogos/areas";
export * from "./catalogos/medios_pagos";

// Seguridad (exportar antes de trabajadores porque trabajadores referencia perfiles)
export * from "./seguridad/perfiles";
export * from "./seguridad/modulos";
export * from "./seguridad/permisos";

// Catalogos con dependencias
export * from "./catalogos/clientes";
export * from "./catalogos/ficha_cliente";
export * from "./catalogos/descuentos";
export * from "./catalogos/trabajadores";
export * from "./catalogos/productos";
export * from "./catalogos/almacenes";
export * from "./catalogos/tipo_movtos";

// Inventario
export * from "./inventario/inventario";

// Nómina
export * from "./nomina/comisiones";

// Agenda
export * from "./agenda/citas";
export * from "./agenda/notificaciones";

// Transacciones (dependen de catalogos)
export * from "./ventas/ventas";

// Relaciones
export * from "./relations";
