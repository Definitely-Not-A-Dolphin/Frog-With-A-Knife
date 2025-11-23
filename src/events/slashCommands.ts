import { Events, type Interaction, MessageFlags } from "discord.js";
import type { BotEvent, SlashCommand } from "../customTypes.ts";
import { slashCommands } from "../collectCommands.ts";

const slashCommandsRecord: Record<string, SlashCommand> = {};
for (const slashCommand of slashCommands) {
  slashCommandsRecord[slashCommand.data.name] = slashCommand;
}

export const slashCommandEvent: BotEvent = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command: SlashCommand | undefined =
      slashCommandsRecord[interaction.commandName];

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
