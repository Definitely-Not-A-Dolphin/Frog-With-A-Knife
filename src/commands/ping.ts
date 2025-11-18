import { type Message, SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand } from "../customTypes.ts";

export const ping: NonSlashCommand = {
  match: (message: Message) => message.content === ".ping",
  execute: async (message: Message) => {
    const diff = Date.now() - message.createdTimestamp;
    console.log(
      `\x1b[36m > \x1b[0m Pinged ${message.author.username}.`,
    );
    await message.reply(`Pong! Latency: ${diff}ms`);
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
      .catch(console.error);
  },
};
