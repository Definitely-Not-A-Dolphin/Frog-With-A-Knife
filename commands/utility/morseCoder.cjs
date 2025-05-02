const { SlashCommandBuilder } = require('discord.js');

function morseEncoder(message) {
  message = message.toLowerCase();

  let newMessage = "";

  const conversionTable = new Map([
    ["a", "⸱-"],
    ["b", "⸱---"],
    ["c", "-⸱-⸱"],
    ["d", "-⸱⸱"],
    ["e", "⸱"],
    ["f", "⸱⸱-⸱"],
    ["f", "--⸱"],
    ["g", "--⸱"],
    ["h", "⸱⸱⸱⸱"],
    ["i", "⸱⸱"],
    ["j", "⸱---"],
    ["k", "-⸱-"],
    ["l", "⸱-⸱⸱"],
    ["m", "--"],
    ["n", "-⸱"],
    ["o", "---"],
    ["p", "⸱--⸱"],
    ["q", "--⸱-"],
    ["r", "⸱-⸱"],
    ["s", "⸱⸱⸱"],
    ["t", "-"],
    ["u", "⸱⸱-"],
    ["v", "⸱⸱⸱-"],
    ["w", "⸱--"],
    ["x", "-⸱⸱-"],
    ["y", "-⸱--"],
    ["z", "--⸱⸱"],
    [" ", "   "]
  ]);

  let i = 0;

  for (i; i <= message.length - 1; i++) {
    newMessage += conversionTable.get(message[i]) + " ";
  };

  newMessage = newMessage.substring(0, newMessage.length - 1);

  // Replaces all "undefine"s with # for readability

  newMessage = newMessage.replace(/undefined/g, "#");

  return newMessage;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('morsecoder')
    .setDescription('Encodes a message into Morse code!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to encode')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Getting input
    const input = interaction.options.getString('input');
    await interaction.reply({
      content: morseEncoder(input), withResponse: true
    })

    if (morseEncoder(input).includes("undefined", "")) {
      await interaction.reply({
        content: "\n" + "-# This translation contains characters I haven't figured out yet.", withResponse: true
      }).then((response) => console.log(`"${interaction.user.username}" ordered "${input} ". Replied "${response.resource.message.content}".`))
        .catch(console.error)
    }
  },
};