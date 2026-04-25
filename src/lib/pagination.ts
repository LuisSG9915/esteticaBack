import type { Context } from "hono";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { count, type SQL } from "drizzle-orm";
import type { Database } from "../types";

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getPagination(c: Context): PaginationParams {
  const page = Math.max(1, parseInt(c.req.query("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") || "20")));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getTotal(
  db: Database,
  table: SQLiteTableWithColumns<any>,
  where?: SQL,
): Promise<number> {
  let query = db.select({ total: count() }).from(table).$dynamic();
  if (where) {
    query = query.where(where);
  }
  const result = await query.get();
  return result?.total ?? 0;
}
