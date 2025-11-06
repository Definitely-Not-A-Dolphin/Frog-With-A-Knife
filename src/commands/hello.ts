import type { Message } from "discord.js";
import type { NonSlashCommand } from "$src/customTypes.ts";

export const hello: NonSlashCommand = {
  keyword: "Hello <@1363950316562944090>",
  execute: (message: Message): void => {
    message.reply(`Hello <@${message.author.id}>!`);
  },
};
