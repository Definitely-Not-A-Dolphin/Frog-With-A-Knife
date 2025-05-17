import memeData from "../commandFiles/getMeme/memes.json" with { type: "json" };
import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

let optionsObjectArray = [];
let optionsArray = [];
for (let i = 0; i <= memeData.array.length - 1; i++) {
  optionsObjectArray.push({ name: memeData.array[i].name, value: memeData.array[i].attachment });
  optionsArray.push(memeData.array[i].name);
};

export const data = new SlashCommandBuilder()
  .setName("get-meme-name")
  .setDescription(`Gives you one of ${memeData.array.length} memes based on their name!`)
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("enter a meme name")
      .setRequired(true)
  );

export async function execute(interaction) {
  const input = interaction.options.getString("input");

  // Meme not found
  if (!optionsArray.includes(input)) {
    await interaction
      .reply({
        content: "Couldn't find the meme you were looking for, sorry :(. Maybe try again later?"
      })
      .then((/* response */) =>
        console.log(`Gave ${interaction.user.username} meme not found: input: ${input}.`),)
      .catch(console.error);
    return;
  };

  let index;
  // Loops through memeData.array to find the matching attachment
  for (let i = 0; i <= memeData.array.length - 1; i++) {
    if (memeData.array[i].name === input) {
      index = i
    }
  }

  const file = new AttachmentBuilder(
    "./commands/commandFiles/getMeme/DCBotmemes/"
    + memeData.array[index].attachment
  )
    .setName(memeData.array[index].name)
    .setDescription(memeData.array[index].description);

  const memeEmbed = new EmbedBuilder()
    .setTitle(`${memeData.array[index].name}.\nMeme #${input}`)
    .setImage("attachment://" + memeData.array[index].attachment);

  await interaction
    .reply({
      withResponse: true,
      embeds: [memeEmbed],
      files: [file.attachment]
    })
    .then((/* response */) =>
      console.log(`Gave ${interaction.user.username} meme "${input}".`),)
    .catch(console.error);
}