import { type Message, SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand } from "../customTypes.ts";

export const ping: NonSlashCommand = {
  name: "ping",
  command: ".ping",
  description: "ping pong",
  showInHelp: true,
  match: (message: Message) => message.content === ping.command,
  execute: async (message: Message) => {
    const diff = Date.now() - message.createdTimestamp;

    await message.reply(`Pong! Latency: ${diff}ms`);
    return `${message.author.username} used .ping, ping was ${diff}`;
  },
};

export const slashPing: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  execute: async (interaction) => {
    const diff = Date.now() - interaction.createdTimestamp;

    console.log(`\x1b[31m > \x1b[0m Pinged "${interaction.user.username}".`);
    await interaction
      .reply({
        content: `Pong! Latency: ${diff}ms`,
        withResponse: true,
      })
      .catch((err) => console.error(err));
  },
};
