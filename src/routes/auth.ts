import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppEnv } from "../types";
import { cat_nomina_trabajadores } from "../db/schema";
import { verifyPassword } from "../lib/password";

const app = new Hono<AppEnv>();

const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

/**
 * POST /api/auth/login
 *
 * Endpoint PÚBLICO (no pasa por authMiddleware).
 * Valida credenciales y devuelve { token, trabajador }.
 *
 * El "token" actual es el id del trabajador (compatible con el authMiddleware
 * existente que valida `Bearer <trabajadorId>`). Cuando se migre a JWT real,
 * solo cambia esta función.
 */
app.post("/login", zValidator("json", loginSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const db = c.get("db");

  const trabajador = await db
    .select()
    .from(cat_nomina_trabajadores)
    .where(eq(cat_nomina_trabajadores.username, username))
    .get();

  if (!trabajador) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  const ok = await verifyPassword(password, trabajador.password_hash);
  if (!ok) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  // No exponemos el hash al cliente
  const { password_hash: _omit, ...safeTrabajador } = trabajador;

  return c.json({
    token: String(trabajador.id),
    trabajador: safeTrabajador,
  });
});

export default app;
