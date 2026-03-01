import type { NonSlashCommand } from "../types.ts";

export const perkele: NonSlashCommand = {
  name: "perkele",
  command: /perkele/i,
  description: "perkele",
  showInHelp: false,
  match: (message) =>
    Boolean(message.content.match(perkele.command)) && !message.author.bot,
  execute: async (message) => {
    await message.reply("PERKELE!!");
    return `${message.author.username} said perkele!`;
  },
};

export const perhana: NonSlashCommand = {
  name: "perhana",
  command: /perhana/i,
  description: "perhana",
  showInHelp: false,
  match: (message) =>
    Boolean(message.content.match(perhana.command)) && !message.author.bot,
  execute: async (message) => {
    await message.reply("you are not a five year old kid, just say perkele");
    return `${message.author.username} said perhana!`;
  },
};
