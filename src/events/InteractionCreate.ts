import { Events, type Interaction, MessageFlags } from "discord.js";
import { slashCommands } from "../collectCommands.ts";
import { BotEvent } from "../types.ts";

export const interactionCreateEvent = new BotEvent<Events.InteractionCreate>({
  type: Events.InteractionCreate,
  once: false,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = slashCommands.find((
      slashCommand,
    ) => slashCommand.data.name === interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
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
});
