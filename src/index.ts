import fs from "fs";
import path from "path";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { secrets } from "$src/config.ts";
import {
  type BotEvent,
  BotEventGuard,
  type SlashCommand,
  SlashCommandGuard,
} from "$src/customTypes.ts";

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(import.meta.dirname ?? "", "commands");
const commandFolders = fs.readdirSync(foldersPath);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection<string, SlashCommand>();

// Grabs all files in commands/utility
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const module = await import(`file:///${filePath}`);

    if (!SlashCommandGuard(module)) {
      console.log(
        `[WARNING] The module at ${filePath} is doesn't really look like a slashcommand..`,
      );

      continue;
    }

    const command: SlashCommand = module.default as SlashCommand;

    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }
}

// Construct and prepare an instance of the REST module
const rest: REST = new REST().setToken(secrets.token);

rest.put(Routes.applicationGuildCommands(secrets.clientId, "1363979886838022176"), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(Routes.applicationCommands(secrets.clientId), {
      body: commands,
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

const eventsPath = path.join(import.meta.dirname ?? "", "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath: string = path.join(eventsPath, file);
  const module = await import(`file:///${filePath}`);

  if (!BotEventGuard(module)) {
    console.log(
      `[WARNING] The module at ${filePath} is doesn't really look like an event..`,
    );

    continue;
  }

  const event: BotEvent = module.default as BotEvent;

  if (event.once) {
    client.once(event.type as string, (...args) => event.execute(...args));
  } else {
    client.on(event.type as string, (...args) => event.execute(...args));
  }
}

// Dit runt
client.login(secrets.token);
