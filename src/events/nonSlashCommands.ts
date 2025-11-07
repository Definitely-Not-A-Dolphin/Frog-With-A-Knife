import { Events, type Message, TextChannel } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";
import { nonSlashCommands } from "$src/utils.ts";

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
