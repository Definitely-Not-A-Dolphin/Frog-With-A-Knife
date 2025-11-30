import { SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand } from "../types.ts";

export const ping: NonSlashCommand = {
  name: "ping",
  command: ".ping",
  description: "ping pong",
  showInHelp: true,
  match: (message) => message.content === ping.command,
  execute: async (message) => {
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

    await interaction
      .reply({
        content: `Pong! Latency: ${diff}ms`,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used .ping, ping was ${diff}`;
  },
};
