import type { BotEvent, SlashCommand } from "../types.ts";
import { Events, type Interaction } from "discord.js";
import { slashCommands } from "../collectCommands.ts";

const slashCommandsRecord: Record<string, SlashCommand> = {};
for (const slashCommand of slashCommands) {
  slashCommandsRecord[slashCommand.data.name] = slashCommand;
}

export const autoCompleteEvent: BotEvent = {
  type: Events.InteractionCreate,
  execute: (interaction: Interaction) => {
    if (!interaction.isAutocomplete()) return;

    const slashCommand: SlashCommand | undefined =
      slashCommandsRecord[interaction.commandName];

    if (!slashCommand) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    if (!slashCommand.autocomplete) {
      console.error(
        `This command ('${slashCommand.data.name}) hasn't implemented autocomplete!`,
      );
      return;
    }

    try {
      slashCommand.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  },
};
