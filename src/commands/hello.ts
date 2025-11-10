import type { NonSlashCommand } from "$src/customTypes.ts";
import type { Message } from "discord.js";

export const hello: NonSlashCommand = {
  name: "Hello!",
  match: (message: Message) =>
    message.content === "Hello <@1363950316562944090>",
  execute: (message: Message): void => {
    console.log(
      `\x1b[36m > \x1b[0m Said hello to ${message.author.username}!`,
    );
    message.reply(`Hello <@${message.author.id}>!`);
  },
};
