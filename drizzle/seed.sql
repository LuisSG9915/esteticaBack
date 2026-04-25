-- ─── Seed inicial para estetica DB ────────────────────────────────────────
-- Ejecutar: npx wrangler d1 execute estetica --file=drizzle/seed.sql --remote

-- Catálogo: Sucursales
INSERT OR IGNORE INTO cat_sucursales (id, nombre, direccion) VALUES
  (1, 'Sucursal Principal', 'Dirección principal');

-- Catálogo: Puestos de nómina
INSERT OR IGNORE INTO cat_nomina_puestos (id, nombre) VALUES
  (1, 'Estilista'),
  (2, 'Recepcionista'),
  (3, 'Administrador'),
  (4, 'Colorista'),
  (5, 'Manicurista');

-- Catálogo: Estatus de nómina
INSERT OR IGNORE INTO cat_nomina_estatus (id, nombre) VALUES
  (1, 'Activo'),
  (2, 'Inactivo'),
  (3, 'Baja');

-- Catálogo: Medios de pago
INSERT OR IGNORE INTO cat_medios_pagos (id, nombre) VALUES
  (1, 'Efectivo'),
  (2, 'Tarjeta débito'),
  (3, 'Tarjeta crédito'),
  (4, 'Transferencia'),
  (5, 'Vales');

-- Catálogo: Áreas
INSERT OR IGNORE INTO cat_areas (id, nombre) VALUES
  (1, 'Cabello'),
  (2, 'Uñas'),
  (3, 'Facial'),
  (4, 'Corporal');

-- Catálogo: Departamentos
INSERT OR IGNORE INTO cat_deptos (id, nombre) VALUES
  (1, 'Servicios'),
  (2, 'Productos'),
  (3, 'Insumos');

-- Catálogo: Clases
INSERT OR IGNORE INTO cat_clases (id, nombre) VALUES
  (1, 'Clase A'),
  (2, 'Clase B');

-- Catálogo: Marcas
INSERT OR IGNORE INTO cat_marcas (id, nombre) VALUES
  (1, 'Sin marca'),
  (2, 'L''Oréal'),
  (3, 'Wella'),
  (4, 'Kerastase');

-- Catálogo: Almacenes
INSERT OR IGNORE INTO cat_almacenes (id, nombre) VALUES
  (1, 'Almacén Principal');

-- Catálogo: Tipos de movimiento de inventario
INSERT OR IGNORE INTO cat_tipo_movto (id, nombre) VALUES
  (1, 'Entrada'),
  (2, 'Salida'),
  (3, 'Ajuste'),
  (4, 'Traspaso');

-- Catálogo: Motivos de baja
INSERT OR IGNORE INTO cat_nomina_motivos_bajas (id, nombre) VALUES
  (1, 'Renuncia voluntaria'),
  (2, 'Término de contrato'),
  (3, 'Despido'),
  (4, 'Otro');

-- Perfiles de seguridad
INSERT OR IGNORE INTO cat_perfiles (id, nombre, descripcion) VALUES
  (1, 'Administrador', 'Acceso total al sistema'),
  (2, 'Recepcionista', 'Gestión de agenda y clientes'),
  (3, 'Estilista', 'Consulta de agenda y ventas propias');

-- Trabajador admin inicial (id=1, usar "1" como token Bearer en dev)
-- password_hash es placeholder - implementar hash real cuando se agregue JWT
INSERT OR IGNORE INTO cat_nomina_trabajadores
  (id, nombre, apellidoPaterno, username, password_hash, idPuesto, idEstatus)
VALUES
  (1, 'Admin', 'Sistema', 'admin', 'admin123', 3, 1);
