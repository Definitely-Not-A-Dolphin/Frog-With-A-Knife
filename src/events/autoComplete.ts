import { Events, type Interaction } from "discord.js";
import type { BotEvent, SlashCommand } from "$src/customTypes.ts";

export const autoCompleteEvent: BotEvent = {
  type: Events.InteractionCreate,
  execute: (interaction: Interaction): void => {
    if (!interaction.isAutocomplete()) return;

    const command: SlashCommand | undefined = interaction.client.commands.get(
      interaction.commandName,
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    if (!command.autocomplete) {
      console.error(
        `This command ('${command.data.name}) hasn't implemented autocomplete!`,
      );
      return;
    }

    try {
      command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  },
};
