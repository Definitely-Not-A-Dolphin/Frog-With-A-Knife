import { Database } from "@db/sqlite";
import { env } from "./env.ts";
import { addSigListener } from "./sigHandler.ts";

const basePath: URL = new URL("../", import.meta.url);
export const db: Database = new Database(
  new URL(env.DATABASE_PATH, basePath),
);

const closeListener = () => {
  console.log("Closing DB");
  db.close();
};

addSigListener(closeListener);

db.sql`
  CREATE TABLE IF NOT EXISTS lastfm (
    userId TEXT PRIMARY KEY,
    lastfmUsername TEXT KEY
  );
`;

db.sql`
  CREATE TABLE IF NOT EXISTS kitty (
    userId TEXT PRIMARY KEY,
    kittyCount INTEGER KEY
  );
`;
