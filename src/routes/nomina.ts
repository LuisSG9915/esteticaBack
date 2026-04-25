import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { nomina_comisiones } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertComisionSchema } from "../validators";

const app = new Hono<AppEnv>();

// Listar comisiones (filtro por trabajador, estatus)
app.get("/comisiones", async (c) => {
  const db = c.get("db");
  const trabajador = c.req.query("trabajador");
  const estatus = c.req.query("estatus");

  let query = db.select().from(nomina_comisiones).$dynamic();

  if (trabajador) {
    query = query.where(eq(nomina_comisiones.idTrabajador, parseInt(trabajador)));
  }
  if (estatus) {
    query = query.where(eq(nomina_comisiones.estatus, estatus as "PENDIENTE" | "PAGADA" | "CANCELADA"));
  }

  const pagination = getPagination(c);
  const total = await getTotal(db, nomina_comisiones);
  const rows = await query.limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

// Registrar comisión (validado)
app.post("/comisiones", zValidator("json", insertComisionSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(nomina_comisiones)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// Marcar comisión como pagada
app.patch("/comisiones/:id/pagar", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const result = await db
    .update(nomina_comisiones)
    .set({
      estatus: "PAGADA",
      fechaPago: new Date().toISOString(),
      usuarioEjecuta: c.get("trabajadorId"),
    })
    .where(eq(nomina_comisiones.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Comisión no encontrada" }, 404);
  return c.json(result[0]);
});

export default app;
