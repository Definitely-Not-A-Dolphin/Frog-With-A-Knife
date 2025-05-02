const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  async execute(interaction) {
    // interaction.guild is the object representing the Guild in which the command was run
    await interaction.reply({
      content: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
    })
      .then((response) => console.log(`Reply sent with content "${response.resource.message.content}", ordered by "${interaction.user.username}"`))
      .catch(console.error);
  },
};
