import {
  Client,
  GatewayIntentBits,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { slashCommands } from "./collectCommands.ts";
import env from "./env.ts";
import db from "$src/db.ts";
import { BotEvent } from "./types.ts";
import { coolBanner } from "./utils.ts";

function sigHandler(): Promise<never> {
  console.log("Shutting down...");

  console.log("Closing database");
  db.close();

  Deno.exit();
}

if (Deno.build.os === "windows") Deno.addSignalListener("SIGINT", sigHandler);
else Deno.addSignalListener("SIGTERM", sigHandler);

const client = new Client<true>({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// This type name is fucking brilliant
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const slashCommand of slashCommands) {
  commands.push(slashCommand.data.toJSON());
}

const rest = new REST().setToken(env.get("TOKEN")!);

console.log(
  `Started refreshing ${commands.length} application (/) commands.`,
);

await rest
  .put(Routes.applicationCommands(env.get("CLIENTID")!), { body: commands })
  .catch((err) => console.error(err));

console.log(`Successfully reloaded application (/) commands.`);

const eventFiles = Deno
  .readDirSync("src/events")
  .filter((file) => file.name.endsWith(".ts"));

for (const eventFile of eventFiles) {
  const module = await import(`./events/${eventFile.name}`) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!(entry instanceof BotEvent)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like an event..`,
      );

      continue;
    }

    const event = entry as BotEvent<typeof entry.type>;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
    } else {
      client.on(event.type as string, (...args) => event.execute(...args));
    }
  }
}

client.login(env.get("TOKEN"));
console.log(coolBanner);
