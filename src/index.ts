import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import type { AppEnv } from "./types";
import { dbMiddleware } from "./middleware/db";
import { authMiddleware } from "./middleware/auth";
import { openApiSpec } from "./openapi";

import authRoutes from "./routes/auth";
import catalogosRoutes from "./routes/catalogos";
import clientesRoutes from "./routes/clientes";
import trabajadoresRoutes from "./routes/trabajadores";
import productosRoutes from "./routes/productos";
import ventasRoutes from "./routes/ventas";
import agendaRoutes from "./routes/agenda";
import inventarioRoutes from "./routes/inventario";
import nominaRoutes from "./routes/nomina";
import seguridadRoutes from "./routes/seguridad";

const app = new Hono<AppEnv>();

// ─── Middleware global ──────────────────────────────────────────────────────
app.use("*", logger());
app.use("*", cors());
app.use("*", dbMiddleware);

// ─── Rutas públicas ─────────────────────────────────────────────────────────
app.get("/", (c) => c.json({ status: "ok", service: "estetica-api" }));

// ─── Swagger / OpenAPI (público) ────────────────────────────────────────────
app.get("/openapi.json", (c) => c.json(openApiSpec));
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

// ─── Auth público (login) ───────────────────────────────────────────────────
app.route("/api/auth", authRoutes);

// ─── Auth requerido para todas las rutas /api/* ─────────────────────────────
app.use("/api/*", authMiddleware);

// ─── Montar rutas ───────────────────────────────────────────────────────────
app.route("/api/catalogos", catalogosRoutes);
app.route("/api/clientes", clientesRoutes);
app.route("/api/trabajadores", trabajadoresRoutes);
app.route("/api/productos", productosRoutes);
app.route("/api/ventas", ventasRoutes);
app.route("/api/agenda", agendaRoutes);
app.route("/api/inventario", inventarioRoutes);
app.route("/api/nomina", nominaRoutes);
app.route("/api/seguridad", seguridadRoutes);

// ─── 404 ────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: "Ruta no encontrada" }, 404));

// ─── Error handler global ───────────────────────────────────────────────────
app.onError((err, c) => {
  console.error("Error:", err.message, err.stack);
  return c.json({ error: "Error interno del servidor", detail: err.message }, 500);
});

export default app;
