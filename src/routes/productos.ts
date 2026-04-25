import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { cat_productos } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertProductoSchema, updateProductoSchema } from "../validators";

const app = new Hono<AppEnv>();

// Listar productos (filtro por tipo: servicio, producto, insumo)
app.get("/", async (c) => {
  const db = c.get("db");
  const tipo = c.req.query("tipo");

  let query = db.select().from(cat_productos).$dynamic();

  if (tipo === "servicio") {
    query = query.where(eq(cat_productos.esServicio, 1));
  } else if (tipo === "producto") {
    query = query.where(eq(cat_productos.esProducto, 1));
  } else if (tipo === "insumo") {
    query = query.where(eq(cat_productos.esInsumo, 1));
  }

  const pagination = getPagination(c);
  const total = await getTotal(db, cat_productos);
  const rows = await query.limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

// Obtener producto por ID
app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const producto = await db.select().from(cat_productos).where(eq(cat_productos.id, id)).get();
  if (!producto) return c.json({ error: "Producto no encontrado" }, 404);
  return c.json(producto);
});

// Crear producto (validado)
app.post("/", zValidator("json", insertProductoSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(cat_productos)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// Actualizar producto (validado)
app.put("/:id", zValidator("json", updateProductoSchema), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(cat_productos)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(cat_productos.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Producto no encontrado" }, 404);
  return c.json(result[0]);
});

export default app;
