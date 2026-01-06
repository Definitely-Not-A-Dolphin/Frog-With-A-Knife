import { SlashCommandBuilder } from "discord.js";
import {
  type NonSlashCommand,
  nonSlashCommandGuard,
  type SlashCommand,
  slashCommandGuard,
} from "./types.ts";

const slashCommands: SlashCommand[] = [];
const nonSlashCommands: NonSlashCommand[] = [];

const commandFiles = Deno
  .readDirSync("src/commands/")
  .filter((file) => file.name.endsWith(".ts"));

for (const commandFile of commandFiles) {
  const module = await import(`./commands/${commandFile.name}`) as object;

  for (const [name, command] of Object.entries(module)) {
    if (slashCommandGuard(command)) {
      slashCommands.push(command as SlashCommand);
      continue;
    }

    if (nonSlashCommandGuard(command)) {
      nonSlashCommands.push(command as NonSlashCommand);
      continue;
    }

    console.warn(
      `[WARNING] The export ${name} in module ${commandFile.name} doesn't really look like a command..`,
    );
  }
}

let helpMessage = "";
for (const nonSlashCommand of nonSlashCommands) {
  if (nonSlashCommand.showInHelp) {
    helpMessage +=
      `**${nonSlashCommand.name}** (\`\`${nonSlashCommand.command.toString()}\`\`): ${nonSlashCommand.description}\n`;
  }
}

nonSlashCommands.push({
  name: "help",
  description: "check all available commands",
  command: ";help",
  showInHelp: true,
  match: (message) => message.content === ".help",
  execute: async (message) => {
    await message.reply({ content: helpMessage });
    return `${message.author.username} used .help`;
  },
});

slashCommands.push({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with pong!"),
  execute: async (interaction) => {
    await interaction
      .reply({
        content: helpMessage,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used .help`;
  },
});

console.log(
  "\x1b[34mSlashCommands: \x1b[0m\n",
  slashCommands,
  "\x1b[34mNonSlashCommands: \x1b[0m\n",
  nonSlashCommands,
);

export { nonSlashCommands, slashCommands };
