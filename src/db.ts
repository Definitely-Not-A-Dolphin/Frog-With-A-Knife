import { Database } from "@db/sqlite";
import env from "./env.ts";
import { addSigListener } from "./sigHandler.ts";

const db = new Database(env.DATABASE_PATH);

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
  CREATE TABLE IF NOT EXISTS meow (
    meowId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT KEY,
    guildId TEXT KEY,
    timestamp TEXT KEY
  );
`;

db.sql`
  CREATE TABLE IF NOT EXISTS mipo (
    mipoId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT KEY,
    guildId TEXT KEY,
    timestamp BIGINT KEY
  );
`;

db.sql`
  CREATE TABLE IF NOT EXISTS mipoints (
    mipointId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT KEY,
    guildId TEXT KEY,
    timestamp BIGINT KEY
  );
`;

export default db;
