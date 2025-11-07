import type { NonSlashCommand } from "$src/customTypes.ts";
import type { Message } from "discord.js";

export const hello: NonSlashCommand = {
  keyword: "Hello <@1363950316562944090>",
  execute: (message: Message): void => {
    message.reply(`Hello <@${message.author.id}>!`);
  },
};
