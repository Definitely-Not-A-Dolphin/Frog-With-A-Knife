import SlashCommandBuilder from "discord.js";
import { toLatin, toMorse } from "../../morseTable.json" with { type: "json"};

function morseEncoder(message) {
  message = message.toLowerCase();

  let newMessage = "\\";

  for (let i = 0; i <= message.length - 1; i++) {
    newMessage += toMorse[message[i]];
    if (message[i + 1] !== " ") {
      newMessage += " ";
    };
  };

  newMessage = newMessage.substring(0, newMessage.length - 1);

  if (newMessage.includes("undefined", "")) {
    newMessage += "\n" + "-# This translation contains characters I haven't figured out yet.";
    newMessage = newMessage.replace(/undefined/g, "#");
  };

  return newMessage;
};

export const data = new SlashCommandBuilder()
  .setName("morsecoder")
  .setDescription("Encodes a message into Morse code!")
  .addStringOption(option =>
    option.setName("input")
      .setDescription("The input to encode")
      .setRequired(true)
  );

export async function execute(interaction) {
  const input = interaction.options.getString("input");
  await interaction.reply({
    content: morseEncoder(input), withResponse: true
  })
    .then((response) => console.log(`"${interaction.user.username}" ordered "${input} ". Replied "${response.resource.message.content}".`))
    .catch(console.error);
}