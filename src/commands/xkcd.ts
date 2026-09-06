import {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import { NonSlashCommand, SlashCommand } from "../types.ts";

interface XKCDData {
  month: string;
  num: number;
  link: string;
  year: string;
  news: string;
  safe_title: string;
  transcript: string;
  alt: string;
  img: string;
  title: string;
  day: string;
}

export const xkcd = new NonSlashCommand({
  name: "xkcd",
  command: ";xkcd",
  description: "get an xkcd comic",
  showInHelp: true,
  match(message): boolean {
    return message.content.split(" ")[0] === this.command;
  },
  execute: async (message) => {
    const entry = message.content.split(" ")[1];
    const logMessageBase = `${message.author.username} used ;xkcd <${entry}>: `;
    const xkcdResponse = await fetch(
      entry
        ? `https://xkcd.com/${entry}/info.0.json`
        : "https://xkcd.com/info.0.json",
    );

    if (!xkcdResponse.ok) {
      await message.reply("Ja daar ging iets mis");
      return logMessageBase + "Something went wrong.";
    }

    const xkcdData = await xkcdResponse.json() as XKCDData;
    const xkcdEmbed = new EmbedBuilder({
      title: xkcdData.title,
      description: xkcdData.alt,
    }).setImage(xkcdData.img);

    await message.reply({ embeds: [xkcdEmbed] });
    return logMessageBase + "Command successful.";
  },
});

export const slashxkcd = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("xkcd")
    .setDescription("get an xkcd comic")
    .addIntegerOption((option) =>
      option
        .setName("entry")
        .setDescription("Give an xkcd entry")
    ).setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  execute: async (interaction) => {
    const entry = interaction.options.getInteger("entry");
    const logMessageBase =
      `${interaction.user.username} used /xkcd <${entry}>: `;
    const xkcdResponse = await fetch(
      entry
        ? `https://xkcd.com/${entry}/info.0.json`
        : `https://xkcd.com/info.0.json`,
    );

    if (!xkcdResponse.ok) {
      await interaction.reply({ content: "Ja daar ging iets mis" });
      return logMessageBase + "Something went wrong";
    }

    const xkcdData = await xkcdResponse.json() as XKCDData;
    const xkcdEmbed = new EmbedBuilder({
      title: xkcdData.title,
      description: xkcdData.alt,
    }).setImage(xkcdData.img);

    await interaction.reply({ embeds: [xkcdEmbed] })
      .catch((err) => console.error(err));
    return logMessageBase + "Command successful";
  },
});
