import { Database } from "@db/sqlite";
import { env } from "./env.ts";
import { addSigListener } from "./sigHandler.ts";

const basePath: URL = new URL("../", import.meta.url);
export const db: Database = new Database(
  new URL(env.DATABASE_PATH, basePath),
);

const closeListener = (): void => {
  console.log("Closing DB");
  db.close();
};

addSigListener(closeListener);

db.sql`
  CREATE TABLE IF NOT EXISTS lastfm (
    user_id TEXT PRIMARY KEY,
    lastfm_username TEXT KEY
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    what TEXT KEY,
    who TEXT KEY,
    date TEXT KEY,
    context TEXT KEY
  );
`;
