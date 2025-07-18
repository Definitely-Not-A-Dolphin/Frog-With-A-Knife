import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import memeData from "../../../static/getMeme/memes.json" with { type: "json" };

let optionsArray: string[] = [];
for (let i = 0; i <= memeData.array.length - 1; i++) {
  optionsArray.push(memeData.array[i].name);
}
console.log(optionsArray);

export const data = new SlashCommandBuilder()
  .setName("get-meme-name")
  .setDescription(
    `Gives you one of ${memeData.array.length} memes based on their name!`,
  )
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("enter a meme name")
      .setRequired(true)
      .setAutocomplete(true),
  );

export async function autocomplete(interaction) {
  const focusedValue: string = interaction.options.getFocused();
  const filtered: string[] = optionsArray.filter((choice) =>
    choice.startsWith(focusedValue),
  );
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice })),
  );
}

export async function execute(interaction) {
  const input: string = interaction.options.getString("input");

  // Meme not found
  if (!optionsArray.includes(input)) {
    await interaction
      .reply({
        content:
          "Couldn't find the meme you were looking for, sorry :(. Maybe try again later?",
      })
      .then((/* response */) =>
        console.log(
          `Couldn't give ${interaction.user.username} meme #?, input: ${input}.`,
        ),)
      .catch(console.error);
    return;
  }

  let i;
  // Loops through memeData.array to find the matching attachment
  for (i = 0; i <= memeData.array.length - 1; i++) {
    if (memeData.array[i].name === input) {
      break;
    }
  }

  const file = new AttachmentBuilder(memeData.array[i].name)
    .setDescription(memeData.array[i].description)
    .setFile("./DCBotFiles/getMeme/DCBotmemes/" + memeData.array[i].attachment);

  const memeEmbed = new EmbedBuilder()
    .setTitle(`${memeData.array[i].name}\nMeme #${i + 1}`)
    .setImage("attachment://" + memeData.array[i].attachment);

  await interaction
    .reply({
      withResponse: true,
      embeds: [memeEmbed],
      files: [file.attachment],
    })
    .then((/* response */) =>
      console.log(
        `Gave ${interaction.user.username} meme #${i + 1}: "${input}" from name.`,
      ),)
    .catch(console.error);
}
