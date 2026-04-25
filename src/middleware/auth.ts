import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { cat_nomina_trabajadores } from "../db/schema";
import type { AppEnv } from "../types";

// Middleware básico de autenticación
// TODO: Implementar JWT o session-based auth
export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "No autorizado" }, 401);
  }

  // TODO: Validar token JWT y extraer trabajadorId
  // Por ahora acepta un header simple "Bearer <trabajadorId>" para desarrollo
  const token = authHeader.replace("Bearer ", "");
  const trabajadorId = parseInt(token);

  if (isNaN(trabajadorId)) {
    return c.json({ error: "Token inválido" }, 401);
  }

  const db = c.get("db");
  const trabajador = await db
    .select({ id: cat_nomina_trabajadores.id })
    .from(cat_nomina_trabajadores)
    .where(eq(cat_nomina_trabajadores.id, trabajadorId))
    .get();

  if (!trabajador) {
    return c.json({ error: "Trabajador no encontrado" }, 401);
  }

  c.set("trabajadorId", trabajadorId);
  await next();
});
