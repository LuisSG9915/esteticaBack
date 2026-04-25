import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import type { AppEnv } from "../types";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import {
  cat_sucursales,
  cat_marcas,
  cat_deptos,
  cat_clases,
  cat_areas,
  cat_medios_pagos,
  cat_almacenes,
  cat_tipo_movto,
  cat_descuentos,
  cat_nomina_estatus,
  cat_nomina_puestos,
  cat_nomina_motivos_bajas,
} from "../db/schema";

const app = new Hono<AppEnv>();

// ─── Helpers CRUD genérico para catálogos simples ───────────────────────────
// Esto evita repetir la misma lógica para cada catálogo
function crudRoutes(table: SQLiteTableWithColumns<any>) {
  const router = new Hono<AppEnv>();
  const cols = Object.keys(table) as string[];
  const hasUsuarioEjecuta = cols.includes("usuarioEjecuta");

  const baseSchema = createInsertSchema(table).omit({ id: true } as any);
  const insertSchema = hasUsuarioEjecuta ? baseSchema.omit({ usuarioEjecuta: true } as any) : baseSchema;
  const updateSchema = insertSchema.partial();

  // Listar todos (paginado)
  router.get("/", async (c) => {
    const db = c.get("db");
    const pagination = getPagination(c);
    const total = await getTotal(db, table);
    const rows = await db.select().from(table).limit(pagination.limit).offset(pagination.offset).all();
    return c.json(paginatedResponse(rows, total, pagination));
  });

  // Obtener por ID
  router.get("/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    const row = await db.select().from(table).where(eq(table.id, id)).get();
    if (!row) return c.json({ error: "No encontrado" }, 404);
    return c.json(row);
  });

  const withAudit = (body: object, trabajadorId: number | undefined) =>
    hasUsuarioEjecuta ? { ...body, usuarioEjecuta: trabajadorId } : body;

  // Crear (validado)
  router.post("/", zValidator("json", insertSchema), async (c) => {
    const db = c.get("db");
    const body = c.req.valid("json");
    const result = await db
      .insert(table)
      .values(withAudit(body, c.get("trabajadorId")))
      .returning();
    return c.json(result[0], 201);
  });

  // Actualizar (validado)
  router.put("/:id", zValidator("json", updateSchema), async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    const body = c.req.valid("json");
    const result = await db
      .update(table)
      .set(withAudit(body, c.get("trabajadorId")))
      .where(eq(table.id, id))
      .returning();
    if (!result.length) return c.json({ error: "No encontrado" }, 404);
    return c.json(result[0]);
  });

  // Eliminar
  router.delete("/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    const result = await db.delete(table).where(eq(table.id, id)).returning();
    if (!result.length) return c.json({ error: "No encontrado" }, 404);
    return c.json({ ok: true });
  });

  return router;
}

// ─── Montar catálogos ───────────────────────────────────────────────────────
app.route("/sucursales", crudRoutes(cat_sucursales));
app.route("/marcas", crudRoutes(cat_marcas));
app.route("/deptos", crudRoutes(cat_deptos));
app.route("/clases", crudRoutes(cat_clases));
app.route("/areas", crudRoutes(cat_areas));
app.route("/medios-pagos", crudRoutes(cat_medios_pagos));
app.route("/almacenes", crudRoutes(cat_almacenes));
app.route("/tipo-movtos", crudRoutes(cat_tipo_movto));
app.route("/descuentos", crudRoutes(cat_descuentos));
app.route("/nomina-estatus", crudRoutes(cat_nomina_estatus));
app.route("/nomina-puestos", crudRoutes(cat_nomina_puestos));
app.route("/motivos-bajas", crudRoutes(cat_nomina_motivos_bajas));

export default app;
