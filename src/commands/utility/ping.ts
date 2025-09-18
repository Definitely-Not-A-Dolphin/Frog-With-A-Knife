import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "$src/customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  execute: async (interaction) => {
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

export default slashCommand;
