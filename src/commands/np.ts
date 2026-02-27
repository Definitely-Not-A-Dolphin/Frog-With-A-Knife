import {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  type SlashCommandStringOption,
} from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import db from "../db.ts";
import env from "../env.ts";
import type {
  LastFMData,
  LastFMTrack,
  NonSlashCommand,
  SlashCommand,
  Track,
} from "../types.ts";

const trackEmbedBuilder = async (
  trackPlaying: Track,
  pfp: string,
) =>
  new EmbedBuilder()
    .setTitle(trackPlaying.name)
    .setURL(trackPlaying.url)
    .setAuthor({
      name: "Currently playing",
      iconURL: pfp,
    })
    .setThumbnail(trackPlaying.image)
    .setDescription(`**${trackPlaying.artist}** on _${trackPlaying.album}_`)
    .setColor(
      (await getAverageColor(
        trackPlaying.image,
      )).hex as `#${string}`,
    );

export const lastFMnp: NonSlashCommand = {
  name: "np",
  command: ";np",
  description: "Show your currently playing track!",
  showInHelp: true,
  match: (message) => message.content === lastFMnp.command,
  execute: async (message) => {
    const lastFMUsername: string | null = db
      .sql`SELECT lastfmUsername FROM lastfm WHERE userId = ${message.author.id}`[
        0
      ]?.lastfmUsername;

    if (!lastFMUsername) {
      await message.reply(
        "You need to set a username first!",
      );
      return `${message.author.username} used .np, but forgot to set their username`;
    }

    const baseUrl =
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_KEY}&format=json`;
    const response = await fetch(baseUrl);

    if (!response.ok) {
      await message.reply("Er ging iets mis owo :3");
      return `${message.author.username} used .np, but something went wrong`;
    }

    const lastFMData: LastFMData = await response.json();
    const nowPlayingTrack: LastFMTrack[] = lastFMData.recenttracks.track;

    if (!nowPlayingTrack[0]["@attr"]?.nowplaying) {
      await message.reply("No track is currently playing!");
      return `${message.author.username} used .np, but no music was playing`;
    }

    const nowPlaying: Track = {
      name: nowPlayingTrack[0].name,
      album: nowPlayingTrack[0].album["#text"],
      artist: nowPlayingTrack[0].artist["#text"],
      image: nowPlayingTrack[0].image[3]["#text"],
      url: nowPlayingTrack[0].url,
    };

    const pfpURL = message.author.avatarURL()
      ?? message.author.defaultAvatarURL;

    const trackEmbed = await trackEmbedBuilder(nowPlaying, pfpURL);

    await message.reply({
      embeds: [trackEmbed],
    });
    return `${message.author.username} used .np`;
  },
};

export const lastFMSet: NonSlashCommand = {
  name: "lastFMSet",
  command: ";lastFMSet",
  description: "Set your lastFM username!",
  showInHelp: true,
  match: (message) => message.content.split(" ")[0] === lastFMSet.command,
  execute: async (message) => {
    const lastFMUsername = message.content.split(" ").slice(1).join();

    if (lastFMUsername === "") {
      await message.reply("Dan moet je ook wel een username geven slimmerik");
      return `${message.author.username} used .lastFMSet [], but no username was supplied`;
    }

    try {
      db.sql`DELETE FROM lastfm WHERE userId = ${message.author.id}`;

      db.sql`
        INSERT INTO lastfm (userId, lastfmUsername) VALUES (${message.author.id}, ${lastFMUsername})`;
    } catch (err) {
      console.error(err);
      await message
        .reply("Something went wrong!")
        .catch((err) => console.error(err));
      return `${message.author.username} used .lastFMSet [${lastFMUsername}], but something went wrong`;
    }

    await message.reply(
      `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
    );
    return `${message.author.username} used .lastFMSet [${lastFMUsername}]`;
  },
};

export const slashLastFMnp: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to")
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  execute: async (interaction) => {
    const lastFMUsername: string | null = db
      .sql`SELECT lastfmUsername FROM lastfm WHERE userId = ${interaction.user.id}`[
        0
      ]?.lastfmUsername;

    if (!lastFMUsername) {
      await interaction
        .reply({
          content: "You need to set a username first!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /lastfm-np, but forgot to set their username`;
    }

    const baseUrl =
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_KEY}&format=json`;
    const response: Response = await fetch(baseUrl);

    if (!response.ok) {
      await interaction
        .reply({
          content: "Er ging iets mis owo :3",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /lastfm-np, but something went wrong`;
    }

    const lastFMData: LastFMData = await response.json();
    const nowPlayingTrack: LastFMTrack = lastFMData.recenttracks.track?.[0];

    if (!nowPlayingTrack["@attr"]?.nowplaying) {
      await interaction
        .reply({
          content: "No track is currently playing!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /lastfm-np, but no music was playing`;
    }

    const nowPlaying: Track = {
      name: nowPlayingTrack.name,
      album: nowPlayingTrack.album["#text"],
      artist: nowPlayingTrack.artist["#text"],
      image: nowPlayingTrack.image[3]["#text"],
      url: nowPlayingTrack.url,
    };

    const pfpURL = interaction.user.avatarURL()
      ?? interaction.user.defaultAvatarURL;

    const trackEmbed = await trackEmbedBuilder(
      nowPlaying,
      pfpURL,
    );

    await interaction.reply({
      embeds: [trackEmbed],
      withResponse: true,
    }).catch((err) => console.error(err));
    return `${interaction.user.username} used /lastfm-np`;
  },
};

export const slashLastFMSet: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-set")
    .setDescription("Set your lastfm username!")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("username")
        .setDescription("Enter your lastfm username!")
        .setRequired(true)
    )
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  execute: async (interaction) => {
    const lastFMUsername = interaction.options.getString("username", true);

    try {
      db.sql`
        DELETE FROM lastfm WHERE userId = ${interaction.user.id};
      `;
      db.sql`
        INSERT INTO lastfm (userId, lastfmUsername) VALUES (${interaction.user.id}, ${lastFMUsername})
      `;
    } catch (err) {
      console.error(err);
    }

    await interaction
      .reply({
        content: `Set Last.fm username to _${lastFMUsername}_`,
        withResponse: true,
      }).catch(
        (err) => console.error(err),
      );
    return `${interaction.user.username} used /lastfm-set [${lastFMUsername}]`;
  },
};
