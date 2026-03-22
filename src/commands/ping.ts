import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { NonSlashCommand, SlashCommand } from "../types.ts";

export const ping = new NonSlashCommand({
  name: "ping",
  command: ";ping",
  description: "ping pong",
  showInHelp: true,
  match(message): boolean {
    return message.content === this.command;
  },
  execute: async (message) => {
    const diff = Date.now() - message.createdTimestamp;

    await message.reply(`Pong! Latency: ${diff}ms`);
    return `${message.author.username} used .ping, ping was ${diff}`;
  },
});

export const slashPing = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!")
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
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
});
