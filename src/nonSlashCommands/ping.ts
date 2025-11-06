import type { Message } from "discord.js";
import type { NonSlashCommand } from "$src/customTypes.ts";

export const ping: NonSlashCommand = {
  keyword: ".ping",
  execute: (message: Message): void => {
    const now = Date.now();
    const diff = now - message.createdTimestamp;
    console.log(`Pinged ${message.author.username} via message.`);
    message.reply(`Pong! Latency: ${diff}ms`);
  },
};
