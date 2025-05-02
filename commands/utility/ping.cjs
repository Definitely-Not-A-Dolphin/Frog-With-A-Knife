const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply({
      content: 'Pong!', withResponse: true
    })
    .then((response) => console.log(`"${interaction.user.username}" ordered "${response.resource.message.content}".`))
    .catch(console.error);
  },
};