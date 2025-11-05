import { load } from "@std/dotenv";

const secretKeys = [
  "CLIENTID",
  "PUBLIC_KEY",
  "TOKEN",
  "LASTFM_KEY",
  "DATABASE_PATH",
] as const;

type Thing =
  | "CLIENTID"
  | "PUBLIC_KEY"
  | "TOKEN"
  | "LASTFM_KEY"
  | "DATABASE_PATH";

const env: Record<Thing, string> = await load({
  export: true,
});

for (const key of secretKeys) {
  if (!env[key]) {
    throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
  }
  /*
  if (arrayCount(Object.keys(env), key) > 1) {
    throw new Error(`\x1b[34mDuplicate .env variable ${key}\x1b[0m`);
  }
  */
}

export { env as secrets };
