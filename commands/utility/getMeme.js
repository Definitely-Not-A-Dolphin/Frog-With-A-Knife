import memeData from "./../commandFiles/getMeme/memes.json" with { type: "json" };
import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("get-meme")
  .setDescription("Gives you a meme!")
  .addIntegerOption((option) =>
    option.setName("input").setDescription("enter a number").setRequired(true),
  );

export async function execute(interaction) {
  const input = interaction.options.getInteger("input") - 1;

  if (!(1 <= input <= memeData.array.length)) {
    await interaction
      .reply({
        content: "Ja dat werkt niet zo",
      })
      .then((/* response */) =>
        console.log(
          `Gave ${interaction.user.username} an non-extistant meme (input ${input}).`,
        ),)
      .catch(console.error);
  }

  const file = new AttachmentBuilder(
    "./commands/commandFiles/getMeme/DCBotmemes/" +
      memeData.array[input].attachment,
  )
    .setName(memeData.array[input].name)
    .setDescription(memeData.array[input].description);

  const exampleEmbed = new EmbedBuilder()
    // .setTitle("Some title")
    .setImage("attachment://" + memeData.array[input].attachment);
  await interaction
    .reply({
      withResponse: true,
      embeds: [exampleEmbed],
      files: [file.attachment],
    })
    .then((/* response */) =>
      console.log(`Gave ${interaction.user.username} meme number ${input}.`),)
    .catch(console.error);
}
