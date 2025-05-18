import { Events, MessageFlags } from "discord.js";

export const name = Events.InteractionCreate;
export async function execute(interaction) {
  if (!interaction.isAutocomplete()) return; // check eff of het ook echt deze method is

  const command = interaction.client.commands.get(interaction.commandName); // seems fine

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.autocomplete(interaction); // heb deze functie van execute naar autocomplete veranderd. dan moet je dus op die command object een autocomplete functie hebben die dan word gedraait.
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while autocompleting this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while autocompleting this command!', flags: MessageFlags.Ephemeral });
    }
  }
};  