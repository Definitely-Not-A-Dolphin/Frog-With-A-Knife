import memeData from "../../../static/getMeme/memes.json" with { type: "json" };
import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("get-meme-number")
  .setDescription(
    `Gives you one of ${memeData.array.length} memes based of a number!`,
  )
  .addIntegerOption((option) =>
    option.setName("input").setDescription("enter a number").setRequired(true),
  );

export async function execute(interaction) {
  const input: number = interaction.options.getInteger("input");

  // Out of range error
  if (input < 0 || input > memeData.array.length) {
    await interaction
      .reply({
        content: "Out of range :(. I don't have that meme",
      })
      .then((/* response */) =>
        console.log(`Gave ${interaction.user.username} meme #${input}.`),)
      .catch(console.error);
    return;
  }

  const file = new AttachmentBuilder(
    "./DCBotFiles/getMeme/DCBotmemes/" + memeData.array[input - 1].attachment,
  )
    .setName(memeData.array[input - 1].name)
    .setDescription(memeData.array[input - 1].description);

  const memeEmbed = new EmbedBuilder()
    .setTitle(`${memeData.array[input - 1].name}\nMeme #${input}`)
    .setImage("attachment://" + memeData.array[input - 1].attachment);

  await interaction
    .reply({
      withResponse: true,
      embeds: [memeEmbed],
      files: [file.attachment],
    })
    .then((/* response */) =>
      console.log(
        `Gave ${interaction.user.username} meme #${input}: "${memeData.array[input - 1].name}" from number.`,
      ),)
    .catch(console.error);
}
