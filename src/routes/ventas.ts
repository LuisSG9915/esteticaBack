import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { ventas, ventas_medios_pagos } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertVentaSchema, updateVentaSchema, insertVentaMedioPagoSchema } from "../validators";

const app = new Hono<AppEnv>();

// Listar ventas (con filtro opcional por sucursal y status)
app.get("/", async (c) => {
  const db = c.get("db");
  const sucursal = c.req.query("sucursal");
  const status = c.req.query("status");

  let query = db.select().from(ventas).$dynamic();

  if (sucursal) {
    query = query.where(eq(ventas.idSucursal, parseInt(sucursal)));
  }
  if (status) {
    query = query.where(eq(ventas.status, status as "PROCESO" | "FINALIZADA" | "CANCELADA"));
  }

  const pagination = getPagination(c);
  const total = await getTotal(db, ventas);
  const rows = await query.limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

// Obtener venta por ID con sus medios de pago
app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));

  const venta = await db.select().from(ventas).where(eq(ventas.id, id)).get();

  if (!venta) return c.json({ error: "Venta no encontrada" }, 404);

  const mediosPago = await db.select().from(ventas_medios_pagos).where(eq(ventas_medios_pagos.idVenta, id)).all();

  return c.json({ ...venta, mediosPago });
});

// Crear venta (validado)
app.post("/", zValidator("json", insertVentaSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(ventas)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// Actualizar venta (validado)
app.put("/:id", zValidator("json", updateVentaSchema), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(ventas)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(ventas.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Venta no encontrada" }, 404);
  return c.json(result[0]);
});

// ─── Medios de pago de una venta ────────────────────────────────────────────

// Agregar medio de pago a una venta (validado)
app.post("/:id/medios-pago", zValidator("json", insertVentaMedioPagoSchema), async (c) => {
  const db = c.get("db");
  const idVenta = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .insert(ventas_medios_pagos)
    .values({
      ...body,
      idVenta,
      usuarioEjecuta: c.get("trabajadorId"),
      idTrabajador: c.get("trabajadorId")!,
    })
    .returning();
  return c.json(result[0], 201);
});

// Listar medios de pago de una venta
app.get("/:id/medios-pago", async (c) => {
  const db = c.get("db");
  const idVenta = parseInt(c.req.param("id"));
  const rows = await db.select().from(ventas_medios_pagos).where(eq(ventas_medios_pagos.idVenta, idVenta)).all();
  return c.json(rows);
});

export default app;
