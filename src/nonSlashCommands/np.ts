import type { Track } from "$src/customTypes.ts";
import { getPlayingTrack, trackEmbedBuilder } from "$src/utils.ts";
import { db } from "$src/db.ts";

import type { Message } from "discord.js";
import type { NonSlashCommand } from "$src/customTypes.ts";

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
