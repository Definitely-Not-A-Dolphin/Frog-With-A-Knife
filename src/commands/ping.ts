import type { NonSlashCommand, SlashCommand } from "$src/customTypes.ts";
import { type Message, SlashCommandBuilder } from "discord.js";

export const ping: NonSlashCommand = {
  keyword: ".ping",
  execute: (message: Message): void => {
    const now = Date.now();
    const diff = now - message.createdTimestamp;
    console.log(`Pinged ${message.author.username} via message.`);
    message.reply(`Pong! Latency: ${diff}ms`);
  },
};

export const slashPing: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  execute: async (interaction): Promise<void> => {
    const now = Date.now();
    const diff = now - interaction.createdTimestamp;

    await interaction
      .reply({
        content: `Pong! Latency: ${diff}ms`,
        withResponse: true,
      })
      .then((_response) =>
        console.log(`Pinged "${interaction.user.username}".`)
      )
      .catch(console.error);
  },
};
