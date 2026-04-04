import { load } from "@std/dotenv";

const requiredKeys = [
  "TOKEN",
  "LASTFM_KEY",
  "DATABASE_PATH",
] as const;

const env = new Map(Object.entries(await load()));

for (const key of requiredKeys) {
  if (!env.get(key)) {
    throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
  }
}

console.log("\x1b[34m.env values:\x1b[0m");
for (const [key, value] of env.values()) {
  console.log(
    `\t${key}: \x1b[32m"${
      value.substring(0, 5) + ".".repeat(value.length - 5)
    }"\x1b[0m`,
  );
}

export default env;
