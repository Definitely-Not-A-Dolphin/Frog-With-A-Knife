import { NonSlashCommand } from "../types.ts";

export const perkele = new NonSlashCommand({
  name: "perkele",
  command: /perkele/i,
  description: "perkele",
  showInHelp: false,
  match(message): boolean {
    return Boolean(message.content.match(this.command))
      && !message.author.bot;
  },
  execute: async (message) => {
    await message.reply("PERKELE!!");
    return `${message.author.username} said perkele!`;
  },
});

export const perhana = new NonSlashCommand({
  name: "perhana",
  command: /perhana/i,
  description: "perhana",
  showInHelp: false,
  match(message): boolean {
    return Boolean(message.content.match(this.command))
      && !message.author.bot;
  },
  execute: async (message) => {
    await message.reply("you are not a five year old kid, just say perkele");
    return `${message.author.username} said perhana!`;
  },
});
