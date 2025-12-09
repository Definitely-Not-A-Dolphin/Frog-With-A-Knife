import { Database } from "@db/sqlite";
import { env } from "./env.ts";
import { addSigListener } from "./sigHandler.ts";

const basePath = new URL("../", import.meta.url);
export const db = new Database(
  new URL(env.DATABASE_PATH, basePath),
);

addSigListener(() => {
  console.log("Closing DB");
  db.close();
});

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
