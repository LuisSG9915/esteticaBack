import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./db/schema";

// Bindings de Cloudflare Workers
export type Bindings = {
  DB: D1Database;
};

// Tipo de la DB con schema completo (habilita relational queries)
export type Database = DrizzleD1Database<typeof schema>;

// Variables compartidas en el contexto de Hono
export type Variables = {
  db: Database;
  trabajadorId?: number; // usuario autenticado
};

// Tipo de entorno para Hono
export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
