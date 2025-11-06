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
}

console.log("\x1b[34m.env values:\x1b[0m");
for (const entry of Object.entries(env)) {
  console.log(
    `\t${entry[0]}: \x1b[32m"${
      ".".repeat(entry[1].length).replace(
        /^.{5}/g,
        entry[1].substring(0, 5),
      )
    }"\x1b[0m`,
  );
}

export { env };
