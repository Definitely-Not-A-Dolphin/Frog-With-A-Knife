const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply({
      content: 'Pong!', withResponse: true
    })
      .then((response) => console.log(`Reply sent with content "${response.resource.message.content}", ordered by "${interaction.user.username}"`))
      .catch(console.error);
  },
};