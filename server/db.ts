import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Wrapper to allow app to start without DB for MemStorage mode
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = process.env.DATABASE_URL
  ? drizzle(pool!, { schema })
  : null;
