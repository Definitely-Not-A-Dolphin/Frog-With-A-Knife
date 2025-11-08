import {
  type NonSlashCommand,
  NonSlashCommandGuard,
  type SlashCommand,
  SlashCommandGuard,
} from "$src/customTypes.ts";
import path from "node:path";
import fs from "node:fs";

const slashCommands: SlashCommand[] = [];
const nonSlashCommands: NonSlashCommand[] = [];

// Grabs all files in commands/slashCommands
const commandsPath: string = path.join(
  import.meta.dirname ?? "",
  "commands",
);
const commandFiles: string[] = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath: string = path.join(commandsPath, file);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (SlashCommandGuard(entry[1])) {
      slashCommands.push(entry[1] as SlashCommand);
      continue;
    }

    if (NonSlashCommandGuard(entry[1])) {
      nonSlashCommands.push(entry[1] as NonSlashCommand);
      continue;
    }

    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like a command..`,
    );
  }
}

console.log(slashCommands, nonSlashCommands);

export { nonSlashCommands, slashCommands };
