import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { cat_nomina_trabajadores } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertTrabajadorSchema, updateTrabajadorSchema } from "../validators";

const app = new Hono<AppEnv>();

// Listar trabajadores (paginado)
app.get("/", async (c) => {
  const db = c.get("db");
  const pagination = getPagination(c);
  const total = await getTotal(db, cat_nomina_trabajadores);
  const trabajadores = await db
    .select()
    .from(cat_nomina_trabajadores)
    .limit(pagination.limit)
    .offset(pagination.offset)
    .all();
  return c.json(paginatedResponse(trabajadores, total, pagination));
});

// Obtener trabajador por ID
app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const trabajador = await db.select().from(cat_nomina_trabajadores).where(eq(cat_nomina_trabajadores.id, id)).get();
  if (!trabajador) return c.json({ error: "Trabajador no encontrado" }, 404);
  return c.json(trabajador);
});

// Crear trabajador (validado)
app.post("/", zValidator("json", insertTrabajadorSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  // TODO: Hashear password antes de guardar
  const result = await db
    .insert(cat_nomina_trabajadores)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// Actualizar trabajador (validado)
app.put("/:id", zValidator("json", updateTrabajadorSchema), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(cat_nomina_trabajadores)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(cat_nomina_trabajadores.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Trabajador no encontrado" }, 404);
  return c.json(result[0]);
});

export default app;
