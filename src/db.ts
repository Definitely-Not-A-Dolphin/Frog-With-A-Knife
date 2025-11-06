import { Database } from "@db/sqlite";
import { env } from "$src/config.ts";

const basePath: URL = new URL("../", import.meta.url);
export const db: Database = new Database(
  new URL(env.DATABASE_PATH, basePath),
);

db.exec(`
        CREATE TABLE IF NOT EXISTS lastfm (
        user_id TEXT PRIMARY KEY,
        lastfm_username TEXT KEY
        )
    `);
