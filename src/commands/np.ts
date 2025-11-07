import { env } from "$src/config.ts";
import { EmbedBuilder, type Message, SlashCommandBuilder } from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import type {
  LastFMData,
  LastFMTrack,
  NonSlashCommand,
  SlashCommand,
  Track,
} from "$src/customTypes.ts";
import { db } from "$src/db.ts";

//import { getPlayingTrack, trackEmbedBuilder } from "$src/utils.ts";

export async function getPlayingTrack(
  username: string,
): Promise<boolean | Track> {
  const baseUrl =
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${env.LASTFM_KEY}&format=json`;

  const response = await fetch(baseUrl);

  if (!response.ok) {
    console.log(`Last.fm response code: ${response.status}`);
    console.log(response.url);
    return false;
  }

  const lastFMData: LastFMData = await response.json();
  const dataIWant: LastFMTrack[] = lastFMData.recenttracks.track;

  if (
    dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"] ||
    !dataIWant[0]["@attr"].nowplaying
  ) return true;

  return {
    name: dataIWant[0].name,
    album: dataIWant[0].album["#text"],
    artist: dataIWant[0].artist["#text"],
    image: dataIWant[0].image[3]["#text"],
    url: dataIWant[0].url,
  };
}

export async function trackEmbedBuilder(
  trackPlaying: Track,
  pfp: string,
): Promise<EmbedBuilder> {
  const avgColor = await getAverageColor(trackPlaying.image);
  const anotherThing: [red: number, green: number, blue: number] = [
    avgColor.value[0],
    avgColor.value[1],
    avgColor.value[2],
  ];
  return new EmbedBuilder()
    .setTitle(trackPlaying.name)
    .setURL(trackPlaying.url)
    .setAuthor({
      name: "Currently playing",
      iconURL: pfp,
    })
    .setThumbnail(trackPlaying.image)
    .setDescription(`**${trackPlaying.artist}** on _${trackPlaying.album}_`)
    .setColor(anotherThing);
}

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
