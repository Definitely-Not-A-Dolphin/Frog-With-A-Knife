import { Events, type Interaction, MessageFlags } from "discord.js";
import { slashCommands } from "../collectCommands.ts";
import type { BotEvent, SlashCommand } from "../types.ts";

export const interactionCreateEvent: BotEvent<Events.InteractionCreate> = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command: SlashCommand | undefined = slashCommands.find((
      slashCommand,
    ) => slashCommand.data.name === interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await interaction.deferReply();
      const returnMessage = await command.execute(interaction);
      console.log(`\x1b[36m > \x1b[0m ${returnMessage}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
