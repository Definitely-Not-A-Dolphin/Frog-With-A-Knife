import memeData from "./../commandFiles/getMeme/memes.json" with { type: "json"};
import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("get-meme")
  .setDescription("Replies with Pong!");

const file = new AttachmentBuilder("./commands/commandFiles/getMeme/memes/" + memeData.array[0].attachment)
  .setName(memeData.array[0].name)
  .setDescription(memeData.array[0].description);

const exampleEmbed = new EmbedBuilder()
  .setTitle("Some title")
  .setImage("attachment://" + memeData.array[0].attachment);

export async function execute(interaction) {

  await interaction
    .reply({
      withResponse: true,
      embeds: [exampleEmbed],
      files: [file.attachment]
    })
    .then((/* response */) =>
      console.log(
        `Gave ${interaction.user.username} meme # .`,
      )
    )
    .catch(console.error);
} 