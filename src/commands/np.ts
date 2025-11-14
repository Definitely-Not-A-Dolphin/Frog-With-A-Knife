import type {
  //type CacheType,
  //type ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  //SlashCommandBuilder,
} from "discord.js";
import type {
  LastFMData,
  LastFMTrack,
  NonSlashCommand,
  //SlashCommand,
  Track,
} from "../customTypes.ts";
import { db } from "../db.ts";
import { env } from "../env.ts";
import { trackEmbedBuilder } from "../utils.ts";

export const lastFMnp: NonSlashCommand = {
  match: (message: Message) => message.content.split(" ")[0] === ".np",
  execute: async (message: Message): Promise<void> => {
    let lastFMUsername = message.content.split(" ").slice(1).join();

    // Check of er een arg is
    if (lastFMUsername === "") {
      const thing: { lastfm_username: string | undefined } = db.prepare(
        "SELECT lastfm_username FROM lastfm WHERE user_id = ?",
      ).get(message.author.id) ?? { lastfm_username: undefined };

      // als thing undefined is, is er geen username in de db
      if (thing.lastfm_username === undefined) {
        console.log(
          `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np, but forgot to set their username`,
        );
        message.reply("You need to set a username first!");
        return;
      }

      lastFMUsername = thing.lastfm_username;
    } else if (
      db.prepare(
        "SELECT user_id FROM lastfm WHERE lastfm_username = ?",
      ).get(lastFMUsername) === undefined
    ) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np, but gave an invalid username`,
      );
      message.reply("Could not find someone with that username!");
      return;
    }

    const baseUrl: string =
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_KEY}&format=json`;
    const response: Response = await fetch(baseUrl);

    if (!response.ok) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np, but something went wrong`,
      );
      message.reply("Er ging iets mis owo :3");
      return;
    }

    const lastFMData: LastFMData = await response.json();
    const dataIWant: LastFMTrack[] = lastFMData.recenttracks.track;

    if (
      dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"]
      || !dataIWant[0]["@attr"].nowplaying
    ) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np, but no music was playing`,
      );
      message.reply("No track is currently playing!");
      return;
    }

    const nowPlaying: Track = {
      name: dataIWant[0].name,
      album: dataIWant[0].album["#text"],
      artist: dataIWant[0].artist["#text"],
      image: dataIWant[0].image[3]["#text"],
      url: dataIWant[0].url,
    };

    const pfpURL: string = message.author.avatarURL()
      ?? message.author.defaultAvatarURL;

    const trackEmbed: EmbedBuilder = await trackEmbedBuilder(
      nowPlaying,
      pfpURL,
    );

    console.log(
      `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-np`,
    );
    message.reply({
      embeds: [trackEmbed],
    });
  },
};

export const lastFMSet: NonSlashCommand = {
  match: (message: Message) => message.content.split(" ")[0] === ".lastFMSet",
  execute: (message: Message): void => {
    const lastFMUsername: string = message.content.split(" ").slice(1).join();

    if (lastFMUsername === "") {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-set, but no username was supplied`,
      );
      message.reply("Dan moet je ook wel een username geven slimmerik");
      return;
    }

    try {
      db.prepare(
        "DELETE FROM lastfm WHERE user_id = ?",
      ).get(message.author.id);

      db.prepare(
        "INSERT INTO lastfm (user_id, lastfm_username) VALUES (?, ?)",
      ).get(message.author.id, lastFMUsername);
    } catch (err) {
      console.log(
        `\x1b[36m > \x1b[0m ${message.author.username} used /lastfm-set, but something went wrong`,
      );
      console.error(err);
      message.reply("Something went wrong!");
      return;
    }

    message.reply(
      `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
    );
    console.log(
      `\x1b[36m > \x1b[0m ${message.author.username} used /lastFMSet, new username is ${lastFMUsername}`,
    );
  },
};

/*
export const slashLastFMnp: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to"),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> => {
    const lastFMUsername: { "lastfm_username": string | undefined } = db
      .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
      .get(interaction.user.id) ?? { "lastfm_username": undefined };

    if (!lastFMUsername["lastfm_username"]) {
      console.log(
        `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-np, but forgot to set their username`,
      );
      await interaction
        .reply({
          content: "Y",
          withResponse: true,
        })
        .catch(console.error);
      return;
    }

    const baseUrl: string =
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_KEY}&format=json`;
    const response: Response = await fetch(baseUrl);

    if (!response.ok) {
      console.log(
        `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-np, but something went wrong`,
      );
      console.error("\x1b[32m \t> \x1b[0m Resonse Status: " + response.status);
      await interaction
        .reply({
          content: "Er ging iets mis owo :3",
          withResponse: true,
        })
        .catch(console.error);
      return;
    }

    const lastFMData: LastFMData = await response.json();
    const dataIWant: LastFMTrack[] = lastFMData.recenttracks.track;

    if (
      dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"]
      || !dataIWant[0]["@attr"].nowplaying
    ) {
      await interaction
        .reply({
          content: "No track is currently playing!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-np, but no music was playing`,
          )
        )
        .catch(console.error);
      return;
    }

    const nowPlaying: Track = {
      name: dataIWant[0].name,
      album: dataIWant[0].album["#text"],
      artist: dataIWant[0].artist["#text"],
      image: dataIWant[0].image[3]["#text"],
      url: dataIWant[0].url,
    };

    const pfpURL: string = interaction.user.avatarURL()
      ?? interaction.user.defaultAvatarURL;

    const trackEmbed: EmbedBuilder = await trackEmbedBuilder(
      nowPlaying,
      pfpURL,
    );

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
          `\x1b[31m > \x1b[0m ${interaction.user.username} used /lastfm-set username=${lastFMUsername}`,
        )
      )
      .catch(console.error);
  },
};
*/
