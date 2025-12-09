import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { slashCommands } from "./collectCommands.ts";
import { env } from "./env.ts";
import { type BotEvent, botEventGuard } from "./types.ts";
import { coolBanner } from "./utils.ts";
import { client } from "./client.ts";

// This type name is fucking brilliant
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const slashCommand of slashCommands) {
  commands.push(slashCommand.data.toJSON());
}

const rest = new REST().setToken(env.TOKEN);

console.log(
  `Started refreshing ${commands.length} application (/) commands.`,
);

await rest
  .put(Routes.applicationCommands(env.CLIENTID), { body: commands })
  .catch((err) => console.error(err));

console.log(`Successfully reloaded application (/) commands.`);

const eventFiles = Deno
  .readDirSync("src/events")
  .filter((file) => file.name.endsWith(".ts"));

for (const eventFile of eventFiles) {
  const module = await import(`./events/${eventFile.name}`) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!botEventGuard(entry)) {
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

// Dit runt
client.login(env.TOKEN);
console.log(coolBanner);
