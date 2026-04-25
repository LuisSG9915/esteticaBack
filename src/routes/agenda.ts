import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { agenda_citas, agenda_notificaciones } from "../db/schema";
import { getPagination, paginatedResponse, getTotal } from "../lib/pagination";
import { insertCitaSchema, updateCitaSchema, insertNotificacionSchema } from "../validators";

const app = new Hono<AppEnv>();

// ─── Citas ──────────────────────────────────────────────────────────────────

// Listar citas (filtro por fecha, sucursal, trabajador)
app.get("/citas", async (c) => {
  const db = c.get("db");
  const fecha = c.req.query("fecha");
  const sucursal = c.req.query("sucursal");
  const trabajador = c.req.query("trabajador");

  let query = db.select().from(agenda_citas).$dynamic();

  if (fecha) {
    query = query.where(eq(agenda_citas.fecha, fecha));
  }
  if (sucursal) {
    query = query.where(eq(agenda_citas.idSucursal, parseInt(sucursal)));
  }
  if (trabajador) {
    query = query.where(eq(agenda_citas.idTrabajador, parseInt(trabajador)));
  }

  const pagination = getPagination(c);
  const total = await getTotal(db, agenda_citas);
  const rows = await query.limit(pagination.limit).offset(pagination.offset).all();
  return c.json(paginatedResponse(rows, total, pagination));
});

// Obtener cita por ID
app.get("/citas/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const cita = await db.select().from(agenda_citas).where(eq(agenda_citas.id, id)).get();
  if (!cita) return c.json({ error: "Cita no encontrada" }, 404);
  return c.json(cita);
});

// Crear cita (validado)
app.post("/citas", zValidator("json", insertCitaSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(agenda_citas)
    .values({
      ...body,
      usuarioEjecuta: c.get("trabajadorId"),
      idUsuarioCreador: c.get("trabajadorId"),
    })
    .returning();
  return c.json(result[0], 201);
});

// Actualizar cita (validado)
app.put("/citas/:id", zValidator("json", updateCitaSchema), async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const body = c.req.valid("json");
  const result = await db
    .update(agenda_citas)
    .set({ ...body, usuarioEjecuta: c.get("trabajadorId") })
    .where(eq(agenda_citas.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Cita no encontrada" }, 404);
  return c.json(result[0]);
});

// Cancelar cita (shortcut)
app.patch("/citas/:id/cancelar", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const result = await db
    .update(agenda_citas)
    .set({
      estatus: "CANCELADA",
      fechaModificacion: new Date().toISOString(),
      usuarioEjecuta: c.get("trabajadorId"),
    })
    .where(eq(agenda_citas.id, id))
    .returning();
  if (!result.length) return c.json({ error: "Cita no encontrada" }, 404);
  return c.json(result[0]);
});

// ─── Notificaciones ─────────────────────────────────────────────────────────

// Listar notificaciones de una cita
app.get("/citas/:id/notificaciones", async (c) => {
  const db = c.get("db");
  const idCita = parseInt(c.req.param("id"));
  const rows = await db.select().from(agenda_notificaciones).where(eq(agenda_notificaciones.idCita, idCita)).all();
  return c.json(rows);
});

// Crear notificación (validado)
app.post("/notificaciones", zValidator("json", insertNotificacionSchema), async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const result = await db
    .insert(agenda_notificaciones)
    .values({
      ...body,
      usuarioEjecuta: c.get("trabajadorId"),
      idUsuarioCreador: c.get("trabajadorId"),
    })
    .returning();
  return c.json(result[0], 201);
});

export default app;
