import kittyData from "../../DCBotFiles/getKitty/kitty.json" with { type: "json" };
import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

const optionsArray = ["Sizzle", "Okkie", "Willy"];

export const data = new SlashCommandBuilder()
  .setName("get-kitty")
  .setDescription(`Gives you cat pictures!`)
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("name a cat!")
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function autocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  const filtered = optionsArray.filter(choice => choice.startsWith(focusedValue));
  await interaction.respond(
    filtered.map(choice => ({ name: choice, value: choice })),
  );
}


export async function execute(interaction) {
  const input = interaction.options.getString("input");

  // Meme not found
  if (!optionsArray.includes(input)) {
    await interaction
      .reply({
        content: "Couldn't find the cat you were looking for, sorry :(. Maybe try again later?"
      })
      .then((/* response */) =>
        console.log(`Couldn't give ${interaction.user.username} a cat, input: ${input}.`),)
      .catch(console.error);
    return;
  };

  const file = new AttachmentBuilder()
    .setName(input)
    .setFile("./DCBotFiles/getKitty/sizzle/murderousIntent.jpg"/*  + input.toLowerCase() */)

  const kittyEmbed = new EmbedBuilder()
    .setTitle(input)
    .setImage("attachment://murderousIntent.jpg")

  await interaction
    .reply({
      withResponse: true,
      embeds: [kittyEmbed],
      files: [file.attachment]
    })
    .then((/* response */) =>
      console.log(`Gave ${interaction.user.username} pictures of ${input} to enjoy.`),)
    .catch(console.error);
}