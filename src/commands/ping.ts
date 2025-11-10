import type { NonSlashCommand, SlashCommand } from "$src/customTypes.ts";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  type Message,
  SlashCommandBuilder,
} from "discord.js";

export const ping: NonSlashCommand = {
  name: ".ping",
  match: (message: Message) => message.content === ".ping",
  execute: (message: Message): void => {
    const diff: number = Date.now() - message.createdTimestamp;
    console.log(
      `\x1b[36m > \x1b[0m Pinged ${message.author.username}.`,
    );
    message.reply(`Pong! Latency: ${diff}ms`);
  },
};

export const slashPing: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> => {
    const diff: number = Date.now() - interaction.createdTimestamp;
    await interaction
      .reply({
        content: `Pong! Latency: ${diff}ms`,
        withResponse: true,
      })
      .then(() =>
        console.log(`\x1b[31m > \x1b[0m Pinged "${interaction.user.username}".`)
      )
      .catch(console.error);
  },
};
