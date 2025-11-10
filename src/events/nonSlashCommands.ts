import { Events, type Message, TextChannel } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";
import { nonSlashCommands } from "$src/collectCommands.ts";

export const nonSlashCommandEvent: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const nonSlashCommand of nonSlashCommands) {
      if (nonSlashCommand.match(message)) {
        nonSlashCommand.execute(message);
      }
    }
  },
};
