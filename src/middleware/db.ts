import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import type { AppEnv } from "../types";

// Middleware que inyecta la instancia de Drizzle en el contexto
export const dbMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  c.set("db", db);
  await next();
});
