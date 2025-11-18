import {
  Client,
  GatewayIntentBits,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { slashCommands } from "./collectCommands.ts";
import { type BotEvent, botEventGuard } from "./customTypes.ts";
import { env } from "./env.ts";
import { coolBanner } from "./utils.ts";

// Grab all the command folders from the commands directory you created earlier
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// This type name is fucking brilliant
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const slashCommand of slashCommands) {
  commands.push(slashCommand.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(env.TOKEN);

console.log(
  `Started refreshing ${commands.length} application (/) commands.`,
);

try {
  await rest.put(Routes.applicationCommands(env.CLIENTID), {
    body: commands,
  });

  console.log(`Successfully reloaded application (/) commands.`);
} catch (error) {
  console.error(error);
}

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

    const event = entry as BotEvent;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
      continue;
    }

    client.on(event.type as string, (...args) => event.execute(...args));
  }
}

// Dit runt
client.login(env.TOKEN);
coolBanner();
