import { Events, type Message, TextChannel } from "discord.js";
import {
  type BotEvent,
  type NonSlashCommand,
  NonSlashCommandGuard,
} from "$src/customTypes.ts";
import path from "node:path";
import fs from "node:fs";

const nonSlashCommands: NonSlashCommand[] = [];
const commandPath: string = path.join(
  import.meta.dirname ?? "",
  "../commands",
);
const commandFiles: string[] = fs.readdirSync(commandPath);

for (const file of commandFiles) {
  const filePath = path.join(commandPath, file);
  const module: object = await import(filePath);

  for (const entry of Object.entries(module)) {
    if (!NonSlashCommandGuard(entry[1])) {
      console.error(
        `[WARNING] The module at ${filePath} is doesn't really look like a slashcommand..`,
      );

      continue;
    }

    nonSlashCommands.push(entry[1] as NonSlashCommand);
  }
}

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const nonSlashCommand of nonSlashCommands) {
      if (message.content === nonSlashCommand.keyword) {
        nonSlashCommand.execute(message);
      }
    }
  },
};

export default event;
