import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction) {
  await interaction
    .reply({
      content: "Pong!",
      withResponse: true,
    })
    .then((response) =>
      console.log(
        `Pinged "${interaction.user.username}".`,
      )
    )
    .catch(console.error);
} 