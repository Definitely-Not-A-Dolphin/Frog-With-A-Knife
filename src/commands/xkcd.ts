import { EmbedBuilder, type Message, SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand } from "../types.ts";

type XKCDData = {
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
};

export const xkcd: NonSlashCommand = {
  name: "xkcd",
  command: ".xkcd",
  description: "get an xkcd comic",
  showInHelp: true,
  match: (message: Message) => message.content.split(" ")[0] === xkcd.command,
  execute: async (message: Message) => {
    const entry = message.content.split(" ")[1];
    const xkcdResponse = await fetch(
      entry
        ? `https://xkcd.com/${entry}/info.0.json`
        : "https://xkcd.com/info.0.json",
    );

    if (!xkcdResponse.ok) {
      await message.reply("Ja daar ging iets mis");
      return `${message.author.username} used .xkcd [${entry}], but something went wrong`;
    }

    const xkcdData: XKCDData = await xkcdResponse.json();
    const xkcdEmbed = new EmbedBuilder()
      .setTitle(xkcdData.title)
      .setImage(xkcdData.img)
      .setDescription(xkcdData.alt);

    await message.reply({ embeds: [xkcdEmbed] });
    return `${message.author.username} user .xkcd [${entry}]`;
  },
};

export const slashPing: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("xkcd")
    .setDescription("Replies with pong!")
    .addIntegerOption((option) =>
      option
        .setName("entry")
        .setDescription("Give an xkcd entry")
    ),
  execute: async (interaction) => {
    const entry = interaction.options.getInteger("entry");
    const xkcdResponse = await fetch(
      entry
        ? `https://xkcd.com/${entry}/info.0.json`
        : `https://xkcd.com/info.0.json`,
    );

    if (!xkcdResponse.ok) {
      await interaction.reply("Ja daar ging iets mis");
      return `${interaction.user.username} used .xkcd [${entry}], but something went wrong`;
    }

    const xkcdData: XKCDData = await xkcdResponse.json();
    const xkcdEmbed = new EmbedBuilder()
      .setTitle(xkcdData.title)
      .setImage(xkcdData.img)
      .setDescription(xkcdData.alt);

    await interaction
      .reply({
        embeds: [xkcdEmbed],
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} user .xkcd [${entry}]`;
  },
};
