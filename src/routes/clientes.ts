import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { cat_clientes, cat_ficha_cliente } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertClienteSchema, updateClienteSchema, insertFichaClienteSchema } from "../validators";

const app = new Hono<AppEnv>();

// ─── Clientes ───────────────────────────────────────────────────────────────

// Listar clientes (paginado)
app.get("/", async (c) => {
  const db = c.get("db");
  const pagination = getPagination(c);
  const total = await getTotal(db, cat_clientes);
  const clientes = await db.select().from(cat_clientes).limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(clientes, total, pagination));
});

// Obtener cliente por ID
app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const cliente = await db.select().from(cat_clientes).where(eq(cat_clientes.id, id)).get();
  if (!cliente) return c.json({ error: "Cliente no encontrado" }, 404);
  return c.json(cliente);
});

// Crear cliente (validado)
app.post("/", zValidator("json", insertClienteSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(cat_clientes)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// Actualizar cliente (validado)
app.put("/:id", zValidator("json", updateClienteSchema), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(cat_clientes)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(cat_clientes.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Cliente no encontrado" }, 404);
  return c.json(result[0]);
});

// ─── Ficha Clínica ──────────────────────────────────────────────────────────

// Obtener ficha del cliente
app.get("/:id/ficha", async (c) => {
  const db = c.get("db");
  const idCliente = parseInt(c.req.param("id"));
  const ficha = await db.select().from(cat_ficha_cliente).where(eq(cat_ficha_cliente.idCliente, idCliente)).get();
  if (!ficha) return c.json({ error: "Ficha no encontrada" }, 404);
  return c.json(ficha);
});

// Crear o actualizar ficha del cliente (validado)
app.put("/:id/ficha", zValidator("json", insertFichaClienteSchema), async (c) => {
  const db = c.get("db");
  const idCliente = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const values = { ...body, idCliente, usuarioEjecuta: c.get("trabajadorId") };

  const existente = await db
    .select({ id: cat_ficha_cliente.id })
    .from(cat_ficha_cliente)
    .where(eq(cat_ficha_cliente.idCliente, idCliente))
    .get();

  if (existente) {
    const result = await db
      .update(cat_ficha_cliente)
      .set(values)
      .where(eq(cat_ficha_cliente.id, existente.id))
      .returning();
    return c.json(result[0]);
  }

  const result = await db.insert(cat_ficha_cliente).values(values).returning();
  return c.json(result[0], 201);
});

export default app;
