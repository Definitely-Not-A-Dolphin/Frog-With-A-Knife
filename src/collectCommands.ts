import {
  type NonSlashCommand,
  nonSlashCommandGuard,
  type SlashCommand,
  slashCommandGuard,
} from "./customTypes.ts";

const slashCommands: SlashCommand[] = [];
const nonSlashCommands: NonSlashCommand[] = [];

// Grabs all files in commands/
const commandFiles = Deno
  .readDirSync("src/commands/")
  .filter((file: Deno.DirEntry) => file.name.endsWith(".ts"));

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

console.log(
  "\x1b[34mSlashCommands: \x1b[0m\n",
  slashCommands,
  "\x1b[34mNonSlashCommands: \x1b[0m\n",
  nonSlashCommands,
);

export { nonSlashCommands, slashCommands };
