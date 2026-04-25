// ─── OpenAPI 3.1 Spec para la API de Estética ──────────────────────────────
// Generado programáticamente para mantener DRY con helpers reutilizables

const paginationParams = [
  { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Página" },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", default: 20, maximum: 100 },
    description: "Registros por página",
  },
];

const idParam = { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID del registro" };

const paginatedResponse = (itemRef: string) => ({
  "200": {
    description: "Lista paginada",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            data: { type: "array", items: { $ref: `#/components/schemas/${itemRef}` } },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
              },
            },
          },
        },
      },
    },
  },
});

const jsonBody = (ref: string) => ({
  required: true,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } },
});

const singleResponse = (ref: string, code = "200") => ({
  [code]: {
    description: code === "201" ? "Creado" : "OK",
    content: { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } },
  },
});

const errorResponses = {
  "400": { description: "Datos inválidos" },
  "401": { description: "No autorizado" },
  "404": { description: "No encontrado" },
};

// Helper: genera las 5 operaciones CRUD para un catálogo simple
// schemaName = nombre base; Input schema = schemaName + "Input"
function catalogCrud(path: string, tag: string, schemaName: string) {
  const inputSchema = `${schemaName}Input`;
  return {
    [`/api/catalogos/${path}`]: {
      get: {
        tags: [tag],
        summary: `Listar ${path}`,
        parameters: [...paginationParams],
        responses: { ...paginatedResponse(schemaName), ...errorResponses },
      },
      post: {
        tags: [tag],
        summary: `Crear ${path}`,
        requestBody: jsonBody(inputSchema),
        responses: { ...singleResponse(schemaName, "201"), ...errorResponses },
      },
    },
    [`/api/catalogos/${path}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Obtener ${path} por ID`,
        parameters: [idParam],
        responses: { ...singleResponse(schemaName), ...errorResponses },
      },
      put: {
        tags: [tag],
        summary: `Actualizar ${path}`,
        parameters: [idParam],
        requestBody: jsonBody(inputSchema),
        responses: { ...singleResponse(schemaName), ...errorResponses },
      },
      delete: {
        tags: [tag],
        summary: `Eliminar ${path}`,
        parameters: [idParam],
        responses: { "200": { description: "Eliminado" }, ...errorResponses },
      },
    },
  };
}

const catalogs = [
  ["sucursales", "Sucursal"],
  ["marcas", "Marca"],
  ["deptos", "Departamento"],
  ["clases", "Clase"],
  ["areas", "Area"],
  ["medios-pagos", "MedioPago"],
  ["almacenes", "Almacen"],
  ["tipo-movtos", "TipoMovimiento"],
  ["descuentos", "Descuento"],
  ["nomina-estatus", "NominaEstatus"],
  ["nomina-puestos", "NominaPuesto"],
  ["motivos-bajas", "MotivoBaja"],
];

const catalogPaths = catalogs.reduce(
  (acc, [path, schema]) => ({ ...acc, ...catalogCrud(path!, "Catálogos", schema!) }),
  {},
);

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "API Estética",
    version: "1.0.0",
    description: "API para gestión de estética: catálogos, clientes, ventas, agenda, inventario, nómina y seguridad.",
  },
  servers: [{ url: "/", description: "Local" }],
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Catálogos", description: "CRUD genérico para catálogos simples" },
    { name: "Clientes", description: "Gestión de clientes y fichas clínicas" },
    { name: "Trabajadores", description: "Gestión de empleados" },
    { name: "Productos", description: "Productos, servicios e insumos" },
    { name: "Ventas", description: "Ventas y medios de pago" },
    { name: "Agenda", description: "Citas y notificaciones" },
    { name: "Inventario", description: "Movimientos de inventario" },
    { name: "Nómina", description: "Comisiones" },
    { name: "Seguridad", description: "Perfiles, módulos y permisos" },
  ],
  paths: {
    // ─── Catálogos (12 × 5 = 60 endpoints) ───────────────────────────────
    ...catalogPaths,

    // ─── Clientes ─────────────────────────────────────────────────────────
    "/api/clientes": {
      get: {
        tags: ["Clientes"],
        summary: "Listar clientes",
        parameters: [...paginationParams],
        responses: paginatedResponse("Cliente"),
      },
      post: {
        tags: ["Clientes"],
        summary: "Crear cliente",
        requestBody: jsonBody("ClienteInput"),
        responses: { ...singleResponse("Cliente", "201"), ...errorResponses },
      },
    },
    "/api/clientes/{id}": {
      get: {
        tags: ["Clientes"],
        summary: "Obtener cliente por ID",
        parameters: [idParam],
        responses: { ...singleResponse("Cliente"), ...errorResponses },
      },
      put: {
        tags: ["Clientes"],
        summary: "Actualizar cliente",
        parameters: [idParam],
        requestBody: jsonBody("ClienteInput"),
        responses: { ...singleResponse("Cliente"), ...errorResponses },
      },
    },
    "/api/clientes/{id}/ficha": {
      get: {
        tags: ["Clientes"],
        summary: "Obtener ficha clínica",
        parameters: [idParam],
        responses: { ...singleResponse("FichaCliente"), ...errorResponses },
      },
      put: {
        tags: ["Clientes"],
        summary: "Crear/actualizar ficha clínica",
        parameters: [idParam],
        requestBody: jsonBody("FichaClienteInput"),
        responses: { ...singleResponse("FichaCliente"), ...errorResponses },
      },
    },

    // ─── Trabajadores ─────────────────────────────────────────────────────
    "/api/trabajadores": {
      get: {
        tags: ["Trabajadores"],
        summary: "Listar trabajadores",
        parameters: [...paginationParams],
        responses: paginatedResponse("Trabajador"),
      },
      post: {
        tags: ["Trabajadores"],
        summary: "Crear trabajador",
        requestBody: jsonBody("TrabajadorInput"),
        responses: { ...singleResponse("Trabajador", "201"), ...errorResponses },
      },
    },
    "/api/trabajadores/{id}": {
      get: {
        tags: ["Trabajadores"],
        summary: "Obtener trabajador por ID",
        parameters: [idParam],
        responses: { ...singleResponse("Trabajador"), ...errorResponses },
      },
      put: {
        tags: ["Trabajadores"],
        summary: "Actualizar trabajador",
        parameters: [idParam],
        requestBody: jsonBody("TrabajadorInput"),
        responses: { ...singleResponse("Trabajador"), ...errorResponses },
      },
    },

    // ─── Productos ────────────────────────────────────────────────────────
    "/api/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos",
        parameters: [
          ...paginationParams,
          {
            name: "tipo",
            in: "query",
            schema: { type: "string", enum: ["servicio", "producto", "insumo"] },
            description: "Filtrar por tipo",
          },
        ],
        responses: paginatedResponse("Producto"),
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        requestBody: jsonBody("ProductoInput"),
        responses: { ...singleResponse("Producto", "201"), ...errorResponses },
      },
    },
    "/api/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por ID",
        parameters: [idParam],
        responses: { ...singleResponse("Producto"), ...errorResponses },
      },
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto",
        parameters: [idParam],
        requestBody: jsonBody("ProductoInput"),
        responses: { ...singleResponse("Producto"), ...errorResponses },
      },
    },

    // ─── Ventas ───────────────────────────────────────────────────────────
    "/api/ventas": {
      get: {
        tags: ["Ventas"],
        summary: "Listar ventas",
        parameters: [
          ...paginationParams,
          { name: "sucursal", in: "query", schema: { type: "integer" }, description: "Filtrar por sucursal" },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["PROCESO", "FINALIZADA", "CANCELADA"] },
            description: "Filtrar por status",
          },
        ],
        responses: paginatedResponse("Venta"),
      },
      post: {
        tags: ["Ventas"],
        summary: "Crear venta",
        requestBody: jsonBody("VentaInput"),
        responses: { ...singleResponse("Venta", "201"), ...errorResponses },
      },
    },
    "/api/ventas/{id}": {
      get: {
        tags: ["Ventas"],
        summary: "Obtener venta por ID (incluye medios de pago)",
        parameters: [idParam],
        responses: { ...singleResponse("VentaDetalle"), ...errorResponses },
      },
      put: {
        tags: ["Ventas"],
        summary: "Actualizar venta",
        parameters: [idParam],
        requestBody: jsonBody("VentaInput"),
        responses: { ...singleResponse("Venta"), ...errorResponses },
      },
    },
    "/api/ventas/{id}/medios-pago": {
      get: {
        tags: ["Ventas"],
        summary: "Listar medios de pago de una venta",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Lista de medios de pago",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/VentaMedioPago" } } },
            },
          },
        },
      },
      post: {
        tags: ["Ventas"],
        summary: "Agregar medio de pago a una venta",
        parameters: [idParam],
        requestBody: jsonBody("VentaMedioPagoInput"),
        responses: { ...singleResponse("VentaMedioPago", "201"), ...errorResponses },
      },
    },

    // ─── Agenda ───────────────────────────────────────────────────────────
    "/api/agenda/citas": {
      get: {
        tags: ["Agenda"],
        summary: "Listar citas",
        parameters: [
          ...paginationParams,
          {
            name: "fecha",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Filtrar por fecha (YYYY-MM-DD)",
          },
          { name: "sucursal", in: "query", schema: { type: "integer" }, description: "Filtrar por sucursal" },
          { name: "trabajador", in: "query", schema: { type: "integer" }, description: "Filtrar por trabajador" },
        ],
        responses: paginatedResponse("Cita"),
      },
      post: {
        tags: ["Agenda"],
        summary: "Crear cita",
        requestBody: jsonBody("CitaInput"),
        responses: { ...singleResponse("Cita", "201"), ...errorResponses },
      },
    },
    "/api/agenda/citas/{id}": {
      get: {
        tags: ["Agenda"],
        summary: "Obtener cita por ID",
        parameters: [idParam],
        responses: { ...singleResponse("Cita"), ...errorResponses },
      },
      put: {
        tags: ["Agenda"],
        summary: "Actualizar cita",
        parameters: [idParam],
        requestBody: jsonBody("CitaInput"),
        responses: { ...singleResponse("Cita"), ...errorResponses },
      },
    },
    "/api/agenda/citas/{id}/cancelar": {
      patch: {
        tags: ["Agenda"],
        summary: "Cancelar cita",
        parameters: [idParam],
        responses: { ...singleResponse("Cita"), ...errorResponses },
      },
    },
    "/api/agenda/citas/{id}/notificaciones": {
      get: {
        tags: ["Agenda"],
        summary: "Listar notificaciones de una cita",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Lista de notificaciones",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Notificacion" } } },
            },
          },
        },
      },
    },
    "/api/agenda/notificaciones": {
      post: {
        tags: ["Agenda"],
        summary: "Crear notificación",
        requestBody: jsonBody("NotificacionInput"),
        responses: { ...singleResponse("Notificacion", "201"), ...errorResponses },
      },
    },

    // ─── Inventario ───────────────────────────────────────────────────────
    "/api/inventario": {
      get: {
        tags: ["Inventario"],
        summary: "Listar movimientos de inventario",
        parameters: [
          ...paginationParams,
          { name: "sucursal", in: "query", schema: { type: "integer" }, description: "Filtrar por sucursal" },
          { name: "producto", in: "query", schema: { type: "integer" }, description: "Filtrar por producto" },
        ],
        responses: paginatedResponse("Inventario"),
      },
      post: {
        tags: ["Inventario"],
        summary: "Registrar movimiento de inventario",
        requestBody: jsonBody("InventarioInput"),
        responses: { ...singleResponse("Inventario", "201"), ...errorResponses },
      },
    },

    // ─── Nómina ───────────────────────────────────────────────────────────
    "/api/nomina/comisiones": {
      get: {
        tags: ["Nómina"],
        summary: "Listar comisiones",
        parameters: [
          ...paginationParams,
          { name: "trabajador", in: "query", schema: { type: "integer" }, description: "Filtrar por trabajador" },
          {
            name: "estatus",
            in: "query",
            schema: { type: "string", enum: ["PENDIENTE", "PAGADA", "CANCELADA"] },
            description: "Filtrar por estatus",
          },
        ],
        responses: paginatedResponse("Comision"),
      },
      post: {
        tags: ["Nómina"],
        summary: "Registrar comisión",
        requestBody: jsonBody("ComisionInput"),
        responses: { ...singleResponse("Comision", "201"), ...errorResponses },
      },
    },
    "/api/nomina/comisiones/{id}/pagar": {
      patch: {
        tags: ["Nómina"],
        summary: "Marcar comisión como pagada",
        parameters: [idParam],
        responses: { ...singleResponse("Comision"), ...errorResponses },
      },
    },

    // ─── Seguridad ────────────────────────────────────────────────────────
    "/api/seguridad/perfiles": {
      get: {
        tags: ["Seguridad"],
        summary: "Listar perfiles",
        parameters: [...paginationParams],
        responses: paginatedResponse("Perfil"),
      },
      post: {
        tags: ["Seguridad"],
        summary: "Crear perfil",
        requestBody: jsonBody("PerfilInput"),
        responses: { ...singleResponse("Perfil", "201"), ...errorResponses },
      },
    },
    "/api/seguridad/perfiles/{id}": {
      put: {
        tags: ["Seguridad"],
        summary: "Actualizar perfil",
        parameters: [idParam],
        requestBody: jsonBody("PerfilInput"),
        responses: { ...singleResponse("Perfil"), ...errorResponses },
      },
    },
    "/api/seguridad/perfiles/{id}/permisos": {
      get: {
        tags: ["Seguridad"],
        summary: "Obtener permisos de un perfil",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Lista de permisos",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Permiso" } } },
            },
          },
        },
      },
    },
    "/api/seguridad/modulos": {
      get: {
        tags: ["Seguridad"],
        summary: "Listar módulos",
        parameters: [...paginationParams],
        responses: paginatedResponse("Modulo"),
      },
      post: {
        tags: ["Seguridad"],
        summary: "Crear módulo",
        requestBody: jsonBody("ModuloInput"),
        responses: { ...singleResponse("Modulo", "201"), ...errorResponses },
      },
    },
    "/api/seguridad/permisos": {
      post: {
        tags: ["Seguridad"],
        summary: "Asignar permiso",
        requestBody: jsonBody("PermisoInput"),
        responses: { ...singleResponse("Permiso", "201"), ...errorResponses },
      },
    },
    "/api/seguridad/permisos/{id}": {
      put: {
        tags: ["Seguridad"],
        summary: "Actualizar permiso",
        parameters: [idParam],
        requestBody: jsonBody("PermisoInput"),
        responses: { ...singleResponse("Permiso"), ...errorResponses },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "Token de autenticación. En desarrollo: usar el ID del trabajador como token.",
      },
    },
    schemas: {
      // ─── Catálogos simples ──────────────────────────────────────────────
      Sucursal: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          direccion: { type: "string", nullable: true },
          estatus: { type: "integer", enum: [0, 1] },
          usuarioEjecuta: { type: "integer", nullable: true },
        },
      },
      SucursalInput: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", example: "Sucursal Norte" },
          direccion: { type: "string", example: "Av. Reforma #200" },
          estatus: { type: "integer", enum: [0, 1], default: 1 },
        },
      },
      Marca: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          fechaCreacion: { type: "string" },
        },
      },
      MarcaInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "L'Oréal" } },
      },
      Departamento: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          fechaCreacion: { type: "string" },
        },
      },
      DepartamentoInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Cabello" } },
      },
      Clase: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          fechaCreacion: { type: "string" },
        },
      },
      ClaseInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Coloración" } },
      },
      Area: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          fechaCreacion: { type: "string" },
        },
      },
      AreaInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Uñas" } },
      },
      MedioPago: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          comision: { type: "number" },
          requiereReferencia: { type: "integer" },
          activo: { type: "integer" },
        },
      },
      MedioPagoInput: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", example: "Efectivo" },
          comision: { type: "number", example: 0 },
          requiereReferencia: { type: "integer", enum: [0, 1], default: 0 },
          activo: { type: "integer", enum: [0, 1], default: 1 },
        },
      },
      Almacen: {
        type: "object",
        properties: {
          id: { type: "integer" },
          almacen: { type: "string" },
          sucursal: { type: "integer" },
          fechaCreacion: { type: "string" },
        },
      },
      AlmacenInput: {
        type: "object",
        required: ["almacen"],
        properties: {
          almacen: { type: "string", example: "Almacén General" },
          sucursal: { type: "integer", example: 1 },
        },
      },
      TipoMovimiento: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          fechaCreacion: { type: "string" },
        },
      },
      TipoMovimientoInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Entrada" } },
      },
      Descuento: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idSucursal: { type: "integer" },
          nombre: { type: "string" },
          porcentaje: { type: "number" },
          status: { type: "string", enum: ["ACTIVO", "INACTIVO"] },
        },
      },
      DescuentoInput: {
        type: "object",
        required: ["nombre", "porcentaje"],
        properties: {
          idSucursal: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Descuento VIP" },
          porcentaje: { type: "number", minimum: 0, maximum: 100, example: 10 },
          status: { type: "string", enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" },
        },
      },
      NominaEstatus: {
        type: "object",
        properties: { id: { type: "integer" }, nombre: { type: "string" } },
      },
      NominaEstatusInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "ACTIVO" } },
      },
      NominaPuesto: {
        type: "object",
        properties: { id: { type: "integer" }, nombre: { type: "string" } },
      },
      NominaPuestoInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Estilista" } },
      },
      MotivoBaja: {
        type: "object",
        properties: { id: { type: "integer" }, nombre: { type: "string" } },
      },
      MotivoBajaInput: {
        type: "object",
        required: ["nombre"],
        properties: { nombre: { type: "string", example: "Renuncia voluntaria" } },
      },

      // ─── Clientes ──────────────────────────────────────────────────────
      Cliente: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          apellidoPaterno: { type: "string" },
          apellidoMaterno: { type: "string", nullable: true },
          telefono: { type: "string", nullable: true },
          email: { type: "string", nullable: true },
          fechaNacimeinto: { type: "string", nullable: true },
          tipoCliente: { type: "string", enum: ["NORMAL", "VIP"], nullable: true },
          sucursal_origen: { type: "integer", nullable: true },
          fechaRegistro: { type: "string" },
        },
      },
      ClienteInput: {
        type: "object",
        required: ["nombre", "apellidoPaterno"],
        properties: {
          nombre: { type: "string" },
          apellidoPaterno: { type: "string" },
          apellidoMaterno: { type: "string" },
          telefono: { type: "string", minLength: 10 },
          email: { type: "string", format: "email" },
          fechaNacimeinto: { type: "string" },
          tipoCliente: { type: "string", enum: ["NORMAL", "VIP"] },
          sucursal_origen: { type: "integer" },
        },
      },
      FichaCliente: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idCliente: { type: "integer" },
          alergias: { type: "string", nullable: true },
          padecimientos: { type: "string", nullable: true },
          medicamentos: { type: "string", nullable: true },
          tiposPiel: { type: "string", nullable: true },
          preferenciasProductos: { type: "string", nullable: true },
          notas: { type: "string", nullable: true },
        },
      },
      FichaClienteInput: {
        type: "object",
        properties: {
          alergias: { type: "string" },
          padecimientos: { type: "string" },
          medicamentos: { type: "string" },
          tiposPiel: { type: "string" },
          preferenciasProductos: { type: "string" },
          notas: { type: "string" },
        },
      },

      // ─── Trabajadores ──────────────────────────────────────────────────
      Trabajador: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          apellidoPaterno: { type: "string" },
          apellidoMaterno: { type: "string", nullable: true },
          idSucursal: { type: "integer" },
          idEstatus: { type: "integer" },
          idPuesto: { type: "integer" },
          idPerfil: { type: "integer" },
          username: { type: "string" },
          email: { type: "string", nullable: true },
          telefono: { type: "string", nullable: true },
        },
      },
      TrabajadorInput: {
        type: "object",
        required: ["nombre", "apellidoPaterno", "username", "password_hash"],
        properties: {
          nombre: { type: "string" },
          apellidoPaterno: { type: "string" },
          apellidoMaterno: { type: "string" },
          idSucursal: { type: "integer" },
          idEstatus: { type: "integer" },
          idPuesto: { type: "integer" },
          idPerfil: { type: "integer" },
          username: { type: "string", minLength: 3 },
          password_hash: { type: "string", minLength: 6 },
          email: { type: "string", format: "email" },
          telefono: { type: "string", minLength: 10 },
        },
      },

      // ─── Productos ─────────────────────────────────────────────────────
      Producto: {
        type: "object",
        properties: {
          id: { type: "integer" },
          claveProd: { type: "string" },
          nombre: { type: "string" },
          precio: { type: "number" },
          costo: { type: "number", nullable: true },
          esServicio: { type: "integer" },
          esProducto: { type: "integer" },
          esInsumo: { type: "integer" },
          inventariable: { type: "integer" },
          idMarca: { type: "integer", nullable: true },
          idArea: { type: "integer", nullable: true },
          idDepto: { type: "integer", nullable: true },
          idClase: { type: "integer", nullable: true },
        },
      },
      ProductoInput: {
        type: "object",
        required: ["claveProd", "nombre", "precio"],
        properties: {
          claveProd: { type: "string", minLength: 1 },
          nombre: { type: "string", minLength: 1 },
          precio: { type: "number", minimum: 0 },
          costo: { type: "number", minimum: 0 },
          esServicio: { type: "integer" },
          esProducto: { type: "integer" },
          esInsumo: { type: "integer" },
          inventariable: { type: "integer" },
          idMarca: { type: "integer" },
          idArea: { type: "integer" },
          idDepto: { type: "integer" },
          idClase: { type: "integer" },
        },
      },

      // ─── Ventas ────────────────────────────────────────────────────────
      Venta: {
        type: "object",
        properties: {
          id: { type: "integer" },
          no_venta: { type: "integer" },
          idSucursal: { type: "integer" },
          idCliente: { type: "integer", nullable: true },
          idProducto: { type: "integer" },
          idTrabajador: { type: "integer" },
          cant_producto: { type: "number" },
          precio: { type: "number" },
          descuento: { type: "number" },
          tasaIva: { type: "number" },
          status: { type: "string", enum: ["PROCESO", "FINALIZADA", "CANCELADA"] },
          fecha: { type: "string" },
        },
      },
      VentaDetalle: {
        allOf: [
          { $ref: "#/components/schemas/Venta" },
          {
            type: "object",
            properties: {
              mediosPago: { type: "array", items: { $ref: "#/components/schemas/VentaMedioPago" } },
            },
          },
        ],
      },
      VentaInput: {
        type: "object",
        required: ["no_venta", "cant_producto", "precio", "descuento", "tasaIva"],
        properties: {
          no_venta: { type: "integer", minimum: 1 },
          idSucursal: { type: "integer" },
          idCliente: { type: "integer" },
          idProducto: { type: "integer" },
          idTrabajador: { type: "integer" },
          idDescuento: { type: "integer" },
          cant_producto: { type: "number", minimum: 0 },
          precio: { type: "number", minimum: 0 },
          descuento: { type: "number", minimum: 0 },
          tasaIva: { type: "number", minimum: 0 },
          status: { type: "string", enum: ["PROCESO", "FINALIZADA", "CANCELADA"] },
          observaciones: { type: "string" },
        },
      },
      VentaMedioPago: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idVenta: { type: "integer" },
          idMedioPago: { type: "integer" },
          importe: { type: "number" },
          referencia: { type: "string", nullable: true },
          idTrabajador: { type: "integer" },
        },
      },
      VentaMedioPagoInput: {
        type: "object",
        required: ["idMedioPago", "importe"],
        properties: {
          idMedioPago: { type: "integer" },
          importe: { type: "number", minimum: 0 },
          referencia: { type: "string" },
        },
      },

      // ─── Agenda ────────────────────────────────────────────────────────
      Cita: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idSucursal: { type: "integer" },
          idCliente: { type: "integer" },
          idServicio: { type: "integer" },
          idTrabajador: { type: "integer" },
          fecha: { type: "string", format: "date" },
          horaInicio: { type: "string", example: "10:00" },
          duracionMinutos: { type: "integer" },
          estatus: {
            type: "string",
            enum: ["PENDIENTE", "CONFIRMADA", "ENCURSO", "COMPLETADA", "CANCELADA", "NOASISTIO"],
          },
          origen: { type: "string", enum: ["PRESENCIAL", "TELEFONO", "WHATSAPP", "ONLINE"] },
          precio: { type: "number", nullable: true },
          notasInternas: { type: "string", nullable: true },
        },
      },
      CitaInput: {
        type: "object",
        required: ["fecha", "horaInicio", "duracionMinutos"],
        properties: {
          idSucursal: { type: "integer" },
          idCliente: { type: "integer" },
          idServicio: { type: "integer" },
          idTrabajador: { type: "integer" },
          fecha: { type: "string", format: "date", example: "2025-06-15" },
          horaInicio: { type: "string", example: "10:00" },
          duracionMinutos: { type: "integer", minimum: 1 },
          estatus: {
            type: "string",
            enum: ["PENDIENTE", "CONFIRMADA", "ENCURSO", "COMPLETADA", "CANCELADA", "NOASISTIO"],
          },
          origen: { type: "string", enum: ["PRESENCIAL", "TELEFONO", "WHATSAPP", "ONLINE"] },
          precio: { type: "number" },
          notasInternas: { type: "string" },
        },
      },
      Notificacion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idCita: { type: "integer" },
          idCliente: { type: "integer" },
          tipo: {
            type: "string",
            enum: ["RECORDATORIO_CITA", "CONFIRMACION", "CANCELACION", "PROMOCION", "CUMPLEANOS"],
          },
          canal: { type: "string", enum: ["WHATSAPP", "SMS", "EMAIL", "LLAMADA"] },
          contenido: { type: "string" },
          estatus: { type: "string", enum: ["PENDIENTE", "ENVIADA", "FALLIDA", "CANCELADA"] },
          fechaEnvioProgramado: { type: "string" },
        },
      },
      NotificacionInput: {
        type: "object",
        required: ["tipo", "canal", "fechaEnvioProgramado"],
        properties: {
          idCita: { type: "integer" },
          idCliente: { type: "integer" },
          tipo: {
            type: "string",
            enum: ["RECORDATORIO_CITA", "CONFIRMACION", "CANCELACION", "PROMOCION", "CUMPLEANOS"],
          },
          canal: { type: "string", enum: ["WHATSAPP", "SMS", "EMAIL", "LLAMADA"] },
          contenido: { type: "string" },
          asunto: { type: "string" },
          fechaEnvioProgramado: { type: "string" },
        },
      },

      // ─── Inventario ────────────────────────────────────────────────────
      Inventario: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idSucursal: { type: "integer" },
          idAlmacen: { type: "integer" },
          idProducto: { type: "integer" },
          tipoMovto: { type: "integer" },
          folio: { type: "string" },
          cantidadEntrada: { type: "number" },
          cantidadSalida: { type: "number" },
          fecha: { type: "string" },
        },
      },
      InventarioInput: {
        type: "object",
        required: ["folio"],
        properties: {
          idSucursal: { type: "integer" },
          idAlmacen: { type: "integer" },
          idProducto: { type: "integer" },
          tipoMovto: { type: "integer" },
          folio: { type: "string", minLength: 1 },
          cantidadEntrada: { type: "number", minimum: 0 },
          cantidadSalida: { type: "number", minimum: 0 },
        },
      },

      // ─── Nómina ────────────────────────────────────────────────────────
      Comision: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idTrabajador: { type: "integer" },
          idVenta: { type: "integer" },
          idServicio: { type: "integer" },
          tipoComision: { type: "string", enum: ["PORCENTAJE", "FIJA"] },
          porcentajeComision: { type: "number" },
          montoComision: { type: "number" },
          estatus: { type: "string", enum: ["PENDIENTE", "PAGADA", "CANCELADA"] },
          fechaRegistro: { type: "string" },
          fechaPago: { type: "string", nullable: true },
        },
      },
      ComisionInput: {
        type: "object",
        required: ["montoComision"],
        properties: {
          idTrabajador: { type: "integer" },
          idVenta: { type: "integer" },
          idServicio: { type: "integer" },
          tipoComision: { type: "string", enum: ["PORCENTAJE", "FIJA"] },
          porcentajeComision: { type: "number" },
          montoComision: { type: "number", minimum: 0 },
          estatus: { type: "string", enum: ["PENDIENTE", "PAGADA", "CANCELADA"] },
        },
      },

      // ─── Seguridad ─────────────────────────────────────────────────────
      Perfil: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "integer" },
        },
      },
      PerfilInput: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", minLength: 1 },
          descripcion: { type: "string" },
          activo: { type: "integer" },
        },
      },
      Modulo: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          ruta: { type: "string", nullable: true },
          icono: { type: "string", nullable: true },
          orden: { type: "integer", nullable: true },
          activo: { type: "integer" },
        },
      },
      ModuloInput: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", minLength: 1 },
          descripcion: { type: "string" },
          ruta: { type: "string" },
          icono: { type: "string" },
          orden: { type: "integer" },
          activo: { type: "integer" },
        },
      },
      Permiso: {
        type: "object",
        properties: {
          id: { type: "integer" },
          idPerfil: { type: "integer" },
          idModulo: { type: "integer" },
          crear: { type: "integer" },
          leer: { type: "integer" },
          actualizar: { type: "integer" },
          eliminar: { type: "integer" },
        },
      },
      PermisoInput: {
        type: "object",
        properties: {
          idPerfil: { type: "integer" },
          idModulo: { type: "integer" },
          crear: { type: "integer" },
          leer: { type: "integer" },
          actualizar: { type: "integer" },
          eliminar: { type: "integer" },
        },
      },
    },
  },
};
