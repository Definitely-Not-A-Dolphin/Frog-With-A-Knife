import {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  type SlashCommandStringOption,
  User,
} from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import { NonSlashCommand, SlashCommand, Thing } from "../types.ts";

interface LastFMTrack {
  artist: {
    mbid: string;
    "#text": string;
  };
  streamable: string;
  image: {
    size: string;
    "#text": string;
  }[];
  mbid: string;
  album: {
    mbid: string;
    "#text": string;
  };
  name: string;
  url: string;
  date?: {
    uts: string;
    "@attr": string;
  };
  "@attr"?: {
    nowplaying: boolean;
  };
}

interface LastFMData {
  recenttracks: {
    track: LastFMTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

async function getNowPlaying(
  user: User,
): Promise<Thing> {
  const db = await Deno.openKv(Deno.env.get("DATABASE_PATH"));
  const getLastFMUsername = await db.get<string>(
    ["lastfmusernames", user.id],
  );
  db.close();

  if (!getLastFMUsername.versionstamp) {
    return {
      logMessageExtension: "No username was set for this user.",
      interactionReplyOptions: {
        content: "You need to set a username first!",
        withResponse: true,
      },
      messageReplyOptions: {
        content: "You need to set a username first!",
      },
    };
  }

  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${getLastFMUsername.value}&api_key=${
      Deno.env.get("LASTFM_KEY")
    }&format=json`,
  );

  if (!response.ok) {
    const errorMessage = "Something went wrong while fetching lastfm data.";
    return {
      logMessageExtension: errorMessage,
      interactionReplyOptions: {
        content: errorMessage,
        withResponse: true,
      },
      messageReplyOptions: {
        content: errorMessage,
      },
    };
  }

  const lastFMData = await response.json() as LastFMData;
  const lastTrack = lastFMData.recenttracks.track[0];

  if (!lastTrack["@attr"]?.nowplaying) {
    return {
      logMessageExtension: "Command successful.",
      interactionReplyOptions: {
        content: "No track is currently playing!",
        withResponse: true,
      },
      messageReplyOptions: {
        content: "No track is currently playing!",
      },
    };
  }

  const pfpURL = user.avatarURL() ?? user.defaultAvatarURL;
  const trackEmbed = new EmbedBuilder({
    title: lastTrack.name,
    url: lastTrack.url,
    description: `**${lastTrack.artist["#text"]}** on _${
      lastTrack.album["#text"]
    }_`,
  }).setAuthor({ name: "Currently playing", iconURL: pfpURL })
    .setThumbnail(lastTrack.url)
    // Todo: move this on the constructor parameter object
    .setColor(
      (await getAverageColor(
        lastTrack.url,
      )).hex as `#${string}`,
    );

  return {
    logMessageExtension: "Command successful.",
    interactionReplyOptions: {
      embeds: [trackEmbed],
      withResponse: true,
    },
    messageReplyOptions: {
      embeds: [trackEmbed],
    },
  };
}

export const lastFMnp = new NonSlashCommand({
  name: "np",
  command: ";np",
  description: "Show your currently playing track!",
  showInHelp: true,
  match(message): boolean {
    return message.content === this.command;
  },
  execute: async (message) => {
    const lastFMUsername = message.content.split(" ").slice(1).join();
    const logMessageBase =
      `${message.author.username} used ;np <${lastFMUsername}>: `;

    const { logMessageExtension, messageReplyOptions } = await getNowPlaying(
      message.author,
    );

    await message.reply(messageReplyOptions).catch(console.error);
    return logMessageBase + logMessageExtension;
  },
});

export const slashLastFMnp = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to")
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  execute: async (interaction) => {
    const lastFMUsername = interaction.options.getString("username", true);
    const logMessageBase =
      `${interaction.user.username} used /lastfm-np <${lastFMUsername}>: `;

    const { logMessageExtension, interactionReplyOptions } =
      await getNowPlaying(interaction.user);

    await interaction.reply(interactionReplyOptions).catch(console.error);
    return logMessageBase + logMessageExtension;
  },
});

async function setLastFMUsername(
  lastFMUsername: string,
  user: User,
): Promise<Thing> {
  if (lastFMUsername === "") {
    return {
      logMessageExtension: "No username was supplied.",
      interactionReplyOptions: {
        content: "Dan moet je ook wel een username geven slimmerik",
        withResponse: true,
      },
      messageReplyOptions: {
        content: "Dan moet je ook wel een username geven slimmerik",
      },
    };
  }

  try {
    const db = await Deno.openKv(Deno.env.get("DATABASE_PATH"));
    db.set(["lastfmusernames", user.id], lastFMUsername);
    db.close();
  } catch (err) {
    console.error(err);
    return {
      logMessageExtension:
        "Something went wrong while writing new username to database.",
      interactionReplyOptions: {
        content: "Something went wrong while setting your new username!",
        withResponse: true,
      },
      messageReplyOptions: {
        content: "Something went wrong while setting your new username!",
      },
    };
  }

  return {
    logMessageExtension: "Command successful.",
    interactionReplyOptions: {
      content: `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
      withResponse: true,
    },
    messageReplyOptions: {
      content: `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
    },
  };
}

export const lastFMSet = new NonSlashCommand({
  name: "lastFMSet",
  command: ";lastFMSet",
  description: "Set your lastFM username!",
  showInHelp: true,
  match(message): boolean {
    return message.content.split(" ")[0] === this.command;
  },
  execute: async (message) => {
    const lastFMUsername = message.content.split(" ").slice(1).join();
    const logMessageBase =
      `${message.author.username} used ;lastFMSet <${lastFMUsername}>: `;

    const { logMessageExtension, messageReplyOptions } =
      await setLastFMUsername(lastFMUsername, message.author);

    await message.reply(messageReplyOptions).catch(console.error);
    return logMessageBase + logMessageExtension;
  },
});

export const slashLastFMSet = new SlashCommand({
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
    const logMessageBase =
      `${interaction.user.username} used ;lastFMSet <${lastFMUsername}>: `;

    const { logMessageExtension, interactionReplyOptions } =
      await setLastFMUsername(lastFMUsername, interaction.user);

    await interaction.reply(interactionReplyOptions).catch(console.error);
    return logMessageBase + logMessageExtension;
  },
});
