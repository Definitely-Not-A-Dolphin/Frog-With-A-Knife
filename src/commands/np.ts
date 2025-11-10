import type { NonSlashCommand, SlashCommand, Track } from "$src/customTypes.ts";
import { db } from "$src/db.ts";
import { getPlayingTrack, trackEmbedBuilder } from "$src/utils.ts";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  type EmbedBuilder,
  type Message,
  SlashCommandBuilder,
} from "discord.js";

export const np: NonSlashCommand = {
  match: (message: Message) => message.content === "Show what you are listening to!",
  execute: async (message: Message): Promise<void> => {
    const lastFMUsername: { "lastfm_username": string } | undefined = db
      .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
      .get(message.author.id) ?? undefined;

    if (!lastFMUsername) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} forgot to set their LastFMUsername`,
      );
      message.reply("You need to set a username first!");
      return;
    }

    const thing: boolean | Track = await getPlayingTrack(
      lastFMUsername["lastfm_username"],
    );

    if (thing === false) {
      console.log(
        `\x1b[36m > \x1b[0m Something went wrong while fetching ${message.author.username}'s LastFM data`,
      );
      message.reply("Something went wrong fetching your data :/");
      return;
    }

    if (thing === true) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np, but no music was playing`,
      );
      message.reply("You are currently not listening to anything!");
      return;
    }

    const iconURL: string = message.author.avatarURL()
      ?? message.author.defaultAvatarURL;

    const trackEmbed: EmbedBuilder = await trackEmbedBuilder(thing, iconURL);

    message.reply({
      embeds: [trackEmbed],
    });
  },
};

export const slashLastFMNP: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to"),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> => {
    const lastFMUsername: { "lastfm_username": string } | undefined = db
      .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
      .get(interaction.user.id) ?? undefined;

    if (!lastFMUsername) {
      await interaction
        .reply({
          content: "You need to set a username first!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[31m > \x1b[0m ${interaction.user.username} forgot to set their LastFMUsername`,
          )
        )
        .catch(console.error);
      return;
    }

    const thing: boolean | Track = await getPlayingTrack(
      lastFMUsername["lastfm_username"],
    );

    if (thing === false) {
      await interaction
        .reply({
          content: "Something went wrong fetching your data :/",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[31m > \x1b[0m Something went wrong while fetching ${interaction.user.username}'s LastFM data`,
          )
        )
        .catch(console.error);
      return;
    }

    if (thing === true) {
      await interaction
        .reply({
          content: "You are currently not listening to anything!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-np, but no music was playing`,
          )
        ).catch(console.error);
      return;
    }

    const iconURL: string = interaction.user.avatarURL()
      ?? interaction.user.defaultAvatarURL;
    const trackEmbed: EmbedBuilder = await trackEmbedBuilder(thing, iconURL);

    await interaction
      .reply({
        embeds: [trackEmbed],
        withResponse: true,
      })
      .then(() =>
        console.log(
          `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-np`,
        )
      )
      .catch(console.error);
  },
};

export const slashLastFMSet: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-set")
    .setDescription("Set your lastfm username!")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter your lastfm username!")
        .setRequired(true)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> => {
    const lastFMUsername: string = interaction.options.getString(
      "username",
      true,
    );

    db.prepare(
      "DELETE FROM lastfm WHERE user_id = ?",
    ).get(interaction.user.id);

    db.prepare(
      "INSERT INTO lastfm (user_id, lastfm_username) VALUES (?, ?)",
    ).get(interaction.user.id, lastFMUsername);

    await interaction
      .reply({
        content: `Set Last.fm username to _${lastFMUsername}_`,
        withResponse: true,
      })
      .then(() =>
        console.log(
          `\x1b[31m > \x1b[0m Set ${interaction.user.username}'s lastFM username as ${lastFMUsername}`,
        )
      )
      .catch(console.error);
  },
};
