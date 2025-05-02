const { SlashCommandBuilder } = require('discord.js');

function morseEncoder(message) {
  let newMessage = "";
  
  const conversionTable = new Map([
    ["a", "⸱- "],
    ["b", "⸱--- "],
    ["c", "-⸱-⸱ "],
    ["d", "-⸱⸱ "],
    ["e", "⸱ "],
    ["f", "⸱⸱-⸱ "],
    ["f", "--⸱ "],
    ["g", "--⸱ "],
    ["h", "⸱⸱⸱⸱ "],
    ["i", "⸱⸱ "],
    ["j", "⸱--- "],
    ["k", "-⸱- "],
    ["l", "⸱-⸱⸱ "],
    ["m", "-- "],
    ["n", "-⸱ "],
    ["o", "--- "],
    ["p", "⸱--⸱ "],
    ["q", "--⸱- "],
    ["r", "⸱-⸱ "],
    ["s", "⸱⸱⸱ "],
    ["t", "- "],
    ["u", "⸱⸱- "],
    ["v", "⸱⸱⸱- "],
    ["w", "⸱-- "],
    ["x", "-⸱⸱- "],
    ["y", "-⸱-- "],
    ["z", "--⸱⸱ "],
    [" ", "   "]
  ]);
  
  for (let i = 0; i <= message.length - 1; i++) {
    newMessage += conversionTable.get(message[i]);
  };

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
      .then((response) => console.log(`Reply sent with content "${response.resource.message.content}", ordered by "${interaction.user.username}"`))
      .catch(console.error);
  },
};