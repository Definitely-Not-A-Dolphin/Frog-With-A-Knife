import {
  type NonSlashCommand,
  NonSlashCommandGuard,
  type SlashCommand,
  SlashCommandGuard,
} from "$src/customTypes.ts";
import fs from "node:fs";
import path from "node:path";

export function coolBanner(): void {
  console.log(
    " ______                __          ___ _   _                  _  __      _  __      \n" +
      "|  ____|               \\ \\        / (_) | | |         /\\     | |/ /     (_)/ _|    \n" +
      "| |__ _ __ ___   __ _   \\ \\  /\\  / / _| |_| |__      /  \\    | ' / _ __  _| |_ ___ \n" +
      "|  __| '__/ _ \\ / _` |   \\ \\/  \\/ / | | __| '_ \\    / /\\ \\   |  < | '_ \\| |  _/ _ \\\n" +
      "| |  | | | (_) | (_| |    \\  /\\  /  | | |_| | | |  / ____ \\  | . \\| | | | | ||  __/\n" +
      "|_|  |_|  \\___/ \\__, |     \\/  \\/   |_|\\__|_| |_| /_/    \\_\\ |_|\\_\\_| |_|_|_| \\___|\n" +
      "                 __/ |                                                             \n" +
      "                |___/                                                              \n",
  );
}

// Simple method that returns a random emoji from list
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max - min) + min;
}

export function arrayCount<T>(thing: T[], element: T): number {
  let count = 0;
  thing.forEach((x) => {
    if (x === element) count++;
  });
  return count;
}

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
}

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
