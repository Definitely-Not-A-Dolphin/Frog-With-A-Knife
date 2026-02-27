import { load } from "@std/dotenv";

const requiredKeys = [
  "CLIENTID",
  "TOKEN",
  "LASTFM_KEY",
  "DATABASE_PATH",
  "MIPO_CHANNELS",
] as const;

const env = await load();

for (const key of requiredKeys) {
  if (!env[key]) throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
}

console.log("\x1b[34m.env values:\x1b[0m");
for (const [key, value] of Object.entries(env)) {
  console.log(
    `\t${key}: \x1b[32m"${
      value.substring(0, 5) + ".".repeat(value.length - 5)
    }"\x1b[0m`,
  );
}

export default env;
