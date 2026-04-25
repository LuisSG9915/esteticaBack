import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { cat_perfiles, cat_modulos, permisos } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertPerfilSchema, insertModuloSchema, insertPermisoSchema } from "../validators";

const app = new Hono<AppEnv>();

// ─── Perfiles ───────────────────────────────────────────────────────────────

app.get("/perfiles", async (c) => {
  const db = c.get("db");
  const pagination = getPagination(c);
  const total = await getTotal(db, cat_perfiles);
  const rows = await db.select().from(cat_perfiles).limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

app.post("/perfiles", zValidator("json", insertPerfilSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(cat_perfiles)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

app.put("/perfiles/:id", zValidator("json", insertPerfilSchema.partial()), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(cat_perfiles)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(cat_perfiles.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Perfil no encontrado" }, 404);
  return c.json(result[0]);
});

// ─── Módulos ────────────────────────────────────────────────────────────────

app.get("/modulos", async (c) => {
  const db = c.get("db");
  const pagination = getPagination(c);
  const total = await getTotal(db, cat_modulos);
  const rows = await db.select().from(cat_modulos).limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

app.post("/modulos", zValidator("json", insertModuloSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(cat_modulos)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

// ─── Permisos ───────────────────────────────────────────────────────────────

// Obtener permisos de un perfil
app.get("/perfiles/:id/permisos", async (c) => {
  const db = c.get("db");
  const idPerfil = parseInt(c.req.param("id"));
  const rows = await db.select().from(permisos).where(eq(permisos.idPerfil, idPerfil)).all();
  return c.json(rows);
});

// Asignar/actualizar permiso (validado)
app.post("/permisos", zValidator("json", insertPermisoSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(permisos)
    .values({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .returning();
  return c.json(result[0], 201);
});

app.put("/permisos/:id", zValidator("json", insertPermisoSchema.partial()), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(permisos)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(permisos.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Permiso no encontrado" }, 404);
  return c.json(result[0]);
});

export default app;
