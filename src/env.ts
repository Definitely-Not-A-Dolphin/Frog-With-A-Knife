import { load } from "@std/dotenv";

const secretKeys = [
  "CLIENTID",
  "PUBLIC_KEY",
  "TOKEN",
  "LASTFM_KEY",
  "DATABASE_PATH",
] as const;

const env: Record<string, string> = await load({
  export: true,
  //envPath: "../Frog-With-A-Knife-Token/.env.prod"
});

for (const key of secretKeys) {
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

export { env };
