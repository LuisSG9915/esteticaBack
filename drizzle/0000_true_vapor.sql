CREATE TABLE `cat_sucursales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`direccion` text,
	`estatus` integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `cat_nomina_estatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_nomina_puestos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cat_nomina_motivos_bajas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_marcas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_deptos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_clases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_medios_pagos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`comisionPorcentaje` real DEFAULT 0,
	`requiereReferencia` integer DEFAULT 0,
	`activo` integer DEFAULT 1,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_perfiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`activo` integer DEFAULT 1,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `cat_modulos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`ruta` text,
	`icono` text,
	`orden` integer DEFAULT 0,
	`activo` integer DEFAULT 1,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `permisos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idPerfil` integer,
	`idModulo` integer,
	`puedeVer` integer DEFAULT 0,
	`puedeCrear` integer DEFAULT 0,
	`puedeEditar` integer DEFAULT 0,
	`puedeEliminar` integer DEFAULT 0,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idPerfil`) REFERENCES `cat_perfiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idModulo`) REFERENCES `cat_modulos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellidoPaterno` text,
	`apellidoMaterno` text,
	`domicilio` text,
	`calle` text,
	`numero` text,
	`colonia` text,
	`ciudad` text,
	`estado` text,
	`telefono` text,
	`email` text,
	`sucursal_origen` integer,
	`fechaRegistro` text DEFAULT 'CURRENT_TIMESTAMP',
	`fechaNacimeinto` text,
	`tipoCliente` text DEFAULT 'NORMAL',
	`notasInternas` text,
	`ultimaVisita` text,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`sucursal_origen`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_ficha_cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idCliente` integer,
	`alergiaNickel` integer DEFAULT 0,
	`alergiaLatex` integer DEFAULT 0,
	`alergiaPerfumes` integer DEFAULT 0,
	`alergiaCosmeticos` integer DEFAULT 0,
	`alergiaMedicamentos` text,
	`alergiaOtros` text,
	`embarazo` integer DEFAULT 0,
	`lactancia` integer DEFAULT 0,
	`diabetes` integer DEFAULT 0,
	`hipertension` integer DEFAULT 0,
	`problemasCirculatorios` integer DEFAULT 0,
	`problemasCardiacos` integer DEFAULT 0,
	`tratamientoMedico` integer DEFAULT 0,
	`medicamentosActuales` text,
	`cirugiasRecientes` text,
	`condicionesPiel` text,
	`preferenciaProductos` text,
	`productosNoDeseados` text,
	`preferenciaTrabajador` integer,
	`aceptaTratamientos` integer DEFAULT 0,
	`fechaAceptacion` text,
	`notasTecnicas` text,
	`fechaRegistro` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idCliente`) REFERENCES `cat_clientes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_descuentos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idSucursal` integer,
	`nombre` text NOT NULL,
	`porcentaje` real NOT NULL,
	`status` text DEFAULT 'ACTIVO',
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idSucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_nomina_trabajadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellidoPaterno` text,
	`apellidoMaterno` text,
	`rfc` text,
	`curp` text,
	`idSucursal` integer,
	`idEstatus` integer,
	`idPuesto` integer,
	`idPerfil` integer,
	`sexo` text,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`idMotivoBaja` integer,
	`comisionPorcentaje` real,
	`fechaIngreso` text,
	`fechaBaja` text,
	`telefono` text,
	`email` text,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idSucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idEstatus`) REFERENCES `cat_nomina_estatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idPuesto`) REFERENCES `cat_nomina_puestos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idPerfil`) REFERENCES `cat_perfiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idMotivoBaja`) REFERENCES `cat_nomina_motivos_bajas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cat_nomina_trabajadores_username_unique` ON `cat_nomina_trabajadores` (`username`);--> statement-breakpoint
CREATE TABLE `cat_productos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claveProd` text NOT NULL,
	`nombre` text NOT NULL,
	`nombreCorto` text,
	`sucursalOrigen` integer,
	`idMarca` integer,
	`idArea` integer,
	`idDepto` integer,
	`idClase` integer,
	`inventariable` integer DEFAULT 0,
	`excento` integer DEFAULT 0,
	`obsoleto` integer DEFAULT 0,
	`esKit` integer DEFAULT 0,
	`esInsumo` integer DEFAULT 0,
	`esProducto` integer DEFAULT 0,
	`esServicio` integer DEFAULT 0,
	`tiempoEstimado` integer DEFAULT 0,
	`comision` real DEFAULT 0,
	`tasaIva` real DEFAULT 0,
	`costo` real DEFAULT 0,
	`precio` real NOT NULL,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idMarca`) REFERENCES `cat_marcas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idArea`) REFERENCES `cat_areas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idDepto`) REFERENCES `cat_deptos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idClase`) REFERENCES `cat_clases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_almacenes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`sucursal` integer,
	`almacen` integer,
	`fechaCreacion` text NOT NULL,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`sucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cat_tipo_movto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`fechaCreacion` text NOT NULL,
	`usuarioEjecuta` integer
);
--> statement-breakpoint
CREATE TABLE `inventario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idSucursal` integer,
	`idAlmacen` integer,
	`idProducto` integer,
	`tipoMovto` integer,
	`cantidadEntrada` real NOT NULL,
	`cantidadSalida` real NOT NULL,
	`usuario` integer NOT NULL,
	`folio` text NOT NULL,
	`fecha` text NOT NULL,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idSucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idAlmacen`) REFERENCES `cat_almacenes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idProducto`) REFERENCES `cat_productos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tipoMovto`) REFERENCES `cat_tipo_movto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nomina_comisiones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idTrabajador` integer,
	`idVenta` integer,
	`idServicio` integer,
	`tipoComision` text DEFAULT 'PORCENTAJE',
	`porcentaje` real,
	`montoFijo` real,
	`montoComision` real NOT NULL,
	`estatus` text DEFAULT 'PENDIENTE',
	`fechaPago` text,
	`fechaRegistro` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idTrabajador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idVenta`) REFERENCES `ventas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idServicio`) REFERENCES `cat_productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agenda_citas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idSucursal` integer,
	`idCliente` integer,
	`idServicio` integer,
	`idTrabajador` integer,
	`fecha` text NOT NULL,
	`horaInicio` text NOT NULL,
	`horaFin` text,
	`duracionMinutos` integer NOT NULL,
	`estatus` text DEFAULT 'PENDIENTE',
	`origen` text DEFAULT 'PRESENCIAL',
	`notasCliente` text,
	`notasInternas` text,
	`precioServicio` integer,
	`idUsuarioCreador` integer,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`fechaModificacion` text,
	`idVenta` integer,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idSucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idCliente`) REFERENCES `cat_clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idServicio`) REFERENCES `cat_productos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idTrabajador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idUsuarioCreador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agenda_notificaciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idCita` integer,
	`idCliente` integer,
	`tipo` text NOT NULL,
	`canal` text NOT NULL,
	`contenido` text,
	`telefonoDestino` text,
	`emailDestino` text,
	`fechaEnvioProgramado` text NOT NULL,
	`fechaEnvioReal` text,
	`estatus` text DEFAULT 'PENDIENTE',
	`error` text,
	`respuestaRecibida` text,
	`fechaRespuesta` text,
	`idUsuarioCreador` integer,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idCita`) REFERENCES `agenda_citas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idCliente`) REFERENCES `cat_clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idUsuarioCreador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ventas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idSucursal` integer,
	`idCliente` integer,
	`idDescuento` integer,
	`idTrabajador` integer,
	`idProducto` integer,
	`fecha` text DEFAULT (CURRENT_TIMESTAMP),
	`no_venta` integer NOT NULL,
	`cant_producto` real NOT NULL,
	`precio` real NOT NULL,
	`descuento` real NOT NULL,
	`tasaIva` real NOT NULL,
	`status` text DEFAULT 'PROCESO',
	`observacion` text,
	`corte` integer,
	`corteParcial` integer,
	`usuarioEjecuta` integer,
	FOREIGN KEY (`idSucursal`) REFERENCES `cat_sucursales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idCliente`) REFERENCES `cat_clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idDescuento`) REFERENCES `cat_descuentos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idTrabajador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idProducto`) REFERENCES `cat_productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ventas_medios_pagos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idVenta` integer,
	`idMedioPago` integer,
	`importe` real NOT NULL,
	`corte` integer,
	`corteParcial` integer,
	`referencia` text,
	`fechaCreacion` text DEFAULT (CURRENT_TIMESTAMP),
	`usuarioEjecuta` integer,
	`idTrabajador` integer NOT NULL,
	FOREIGN KEY (`idVenta`) REFERENCES `ventas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idMedioPago`) REFERENCES `cat_medios_pagos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idTrabajador`) REFERENCES `cat_nomina_trabajadores`(`id`) ON UPDATE no action ON DELETE no action
);
