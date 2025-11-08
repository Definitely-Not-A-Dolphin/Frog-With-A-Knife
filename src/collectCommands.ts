import type { NonSlashCommand, SlashCommand } from "$src/customTypes.ts";
import { NonSlashCommandGuard, SlashCommandGuard } from "$src/customTypes.ts";
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
  console.log(path.join(commandsPath, file));
}

for (const file of commandFiles) {
  const filePath: string = path.join(commandsPath, file);
  console.log(`Current filePath: ${filePath}`);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (SlashCommandGuard(entry[1])) {
      console.log(`Added ${entry[0]} as SlashCommand`);
      slashCommands.push(entry[1] as SlashCommand);
      continue;
    }

    if (NonSlashCommandGuard(entry[1])) {
      console.log(`Added ${entry[0]} as NonSlashCommand`);
      nonSlashCommands.push(entry[1] as NonSlashCommand);
      continue;
    }

    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like a command..`,
    );
  }
}

console.log(slashCommands);
console.log(nonSlashCommands);

export { nonSlashCommands, slashCommands };
