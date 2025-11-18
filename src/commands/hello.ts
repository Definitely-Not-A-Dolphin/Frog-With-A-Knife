import type { NonSlashCommand } from "../customTypes.ts";
import type { Message } from "discord.js";

export const hello: NonSlashCommand = {
  match: (message: Message) =>
    message.content.includes("<@1363950316562944090>")
    || message.content.includes("<!1363950316562944090>"),
  execute: async (message: Message) => {
    console.log(
      `\x1b[36m > \x1b[0m Got pinged by ${message.author.username}!`,
    );
    await message.reply(`Wie pingt mij!?`);
  },
};
