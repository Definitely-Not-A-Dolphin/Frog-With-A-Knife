import { env } from "$src/config.ts";
import {
  type BotEvent,
  BotEventGuard,
  type SlashCommand,
} from "$src/customTypes.ts";
import { nonSlashCommands, slashCommands } from "$src/utils.ts";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";

// Grab all the command folders from the commands directory you created earlier
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection<string, SlashCommand>();

const commands = [];
for (const slashCommand of slashCommands) {
  commands.push(slashCommand.data.toJSON());
  client.commands.set(slashCommand.data.name, slashCommand);
}

// commands.push(command.data.toJSON());
// client.commands.set(command.data.name, command);

// Construct and prepare an instance of the REST module
const rest: REST = new REST().setToken(env.TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(Routes.applicationCommands(env.CLIENTID), {
      body: commands,
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

const eventsPath: string = path.join(import.meta.dirname ?? "", "events");
const eventFiles: string[] = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath: string = path.join(eventsPath, file);
  const module = await import(`file:///${filePath}`);

  if (!BotEventGuard(module)) {
    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like an event..`,
    );

    continue;
  }

  const event: BotEvent = module.default as BotEvent;

  if (event.once) {
    client.once(event.type as string, (...args) => event.execute(...args));
    continue;
  }
  client.on(event.type as string, (...args) => event.execute(...args));
}

// Dit runt
client.login(env.TOKEN);

export { nonSlashCommands };
