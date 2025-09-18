import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "$src/customTypes.ts";
import { db } from "$src/db.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-set")
    .setDescription("Set your lastfm username!")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter your lastfm username!")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const lastFMUsername = interaction.options.getString(
      "username",
      true,
    );

    db.prepare(
      "DELETE FROM lastfm WHERE user_id = ?",
    ).get(interaction.user.id);

    db.prepare(
      "INSERT INTO lastfm (user_id, lastfm_username) VALUES (?, ?)",
    ).get(interaction.user.id, lastFMUsername);

    await interaction
      .reply({
        content: `Set Last.fm username to ${lastFMUsername}`,
        withResponse: true,
      })
      .then((response) => console.log(response))
      .catch(console.error);
  },
};

export default slashCommand;
