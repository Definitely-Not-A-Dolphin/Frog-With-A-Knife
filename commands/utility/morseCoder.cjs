const { SlashCommandBuilder } = require('discord.js');

const table = [
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
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "shit man", withResponse: true
    })
      .then((response) => console.log(`Reply sent with content "${response.resource.message.content}", ordered by "${interaction.user.username}"`))
      .catch(console.error);
  },
};