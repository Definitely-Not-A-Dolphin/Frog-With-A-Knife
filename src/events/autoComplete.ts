import { Events } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";

const event: BotEvent = {
  type: Events.InteractionCreate,
  execute: (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const command = interaction.client.commands.get(interaction.commandName);

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

export default event;
