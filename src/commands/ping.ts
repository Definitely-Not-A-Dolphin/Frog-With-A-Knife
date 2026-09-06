import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { NonSlashCommand, SlashCommand, Thing } from "../types.ts";

function doPing(timestamp: number): Thing {
  const diff = Date.now() - timestamp;
  const message = `Pong! Latency: ${diff}ms`;
  return {
    logMessageExtension: "Command successful",
    messageReplyOptions: {
      content: message,
    },
    interactionReplyOptions: {
      content: message,
      withResponse: true,
    },
  };
}

export const ping = new NonSlashCommand({
  name: "ping",
  command: ";ping",
  description: "ping pong",
  showInHelp: true,
  match(message): boolean {
    return message.content === this.command;
  },
  execute: async (message) => {
    const { logMessageExtension, messageReplyOptions } = doPing(
      message.createdTimestamp,
    );

    await message.reply(messageReplyOptions).catch(console.error);
    return `${message.author.username} used ;ping: ` + logMessageExtension;
  },
});

export const slashPing = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!")
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  execute: async (interaction) => {
    const { logMessageExtension, interactionReplyOptions } = doPing(
      interaction.createdTimestamp,
    );

    await interaction.reply(interactionReplyOptions).catch(console.error);
    return `${interaction.user.username} used /ping: ` + logMessageExtension;
  },
});
