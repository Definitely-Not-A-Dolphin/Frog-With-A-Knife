import { type Message, SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand, Track } from "$src/customTypes.ts";
import { db } from "$src/db.ts";
import { getPlayingTrack, trackEmbedBuilder } from "$src/utils.ts";

export const np: NonSlashCommand = {
  keyword: ".np",
  execute: async (message: Message): Promise<void> => {
    const lastFMUsername: { "lastfm_username": string } | undefined = db
      .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
      .get(message.author.id) ?? undefined;

    if (!lastFMUsername) {
      message.reply("You need to set a username first!");
      return;
    }

    const thing: boolean | Track = await getPlayingTrack(
      lastFMUsername["lastfm_username"],
    );

    if (thing === false) {
      message.reply("Something went wrong fetching your data :/");
      return;
    }

    if (thing === true) {
      message.reply("You are currently not listening to anything!");
      return;
    }

    const iconURL = message.author.avatarURL() ??
      message.author.defaultAvatarURL;

    const trackEmbed = await trackEmbedBuilder(thing, iconURL);

    message.reply({
      embeds: [trackEmbed],
    });
  },
};

/*
export const slashLastFMNP: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to"),

  execute: async (interaction): Promise<void> => {
    const lastFMUsername: { "lastfm_username": string } | undefined = db
      .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
      .get(interaction.user.id) ?? undefined;

    if (!lastFMUsername) {
      await interaction
        .reply({
          content: "You need to set a username first!",
          withResponse: true,
        })
        .then((response) => console.log(response))
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
        .then((response) => console.log(response))
        .catch(console.error);
      return;
    }

    if (thing === true) {
      await interaction
        .reply({
          content: "You are currently not listening to anything!",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} used /lastfm-np, but no music was playing`,
          )
        ).catch(console.error);
      return;
    }

    const iconURL = interaction.user.avatarURL() ??
      interaction.user.defaultAvatarURL;

    const trackEmbed = await trackEmbedBuilder(thing, iconURL);
    await interaction
      .reply({
        embeds: [trackEmbed],
        withResponse: true,
      })
      .then((_response) =>
        console.log(`${interaction.user.username} used /lastfm-np`)
      )
      .catch(console.error);
  },
};
*/

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

  execute: async (interaction): Promise<void> => {
    const lastFMUsername = interaction.options.getString(
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
      .then((response) => console.log(response))
      .catch(console.error);
  },
};
