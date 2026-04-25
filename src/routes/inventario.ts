import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { inventario } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertInventarioSchema } from "../validators";

const app = new Hono<AppEnv>();

// Listar movimientos (filtro por sucursal, producto, almacén)
app.get("/", async (c) => {
  const db = c.get("db");
  const sucursal = c.req.query("sucursal");
  const producto = c.req.query("producto");

  let query = db.select().from(inventario).$dynamic();

  if (sucursal) {
    query = query.where(eq(inventario.idSucursal, parseInt(sucursal)));
  }
  if (producto) {
    query = query.where(eq(inventario.idProducto, parseInt(producto)));
  }

  const pagination = getPagination(c);
  const total = await getTotal(db, inventario);
  const rows = await query.limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

// Registrar movimiento de inventario (validado)
app.post("/", zValidator("json", insertInventarioSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(inventario)
    .values({
      ...body,
      usuarioEjecuta: c.get("trabajadorId"),
      usuario: c.get("trabajadorId")!,
    })
    .returning();
  return c.json(result[0], 201);
});

export default app;
