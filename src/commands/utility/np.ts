import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, Track } from "$src/customTypes.ts";
import { db } from "$src/db.ts";
import { getPlayingTrack } from "$src/utils.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("lastfm-np")
    .setDescription("Show what you are listening to"),

  execute: async (interaction) => {
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
        .then((response) => console.log(response))
        .catch(console.error);
      return;
    }

    let iconURL = interaction.user.avatarURL();
    if (!iconURL) iconURL = interaction.user.defaultAvatarURL;

    const trackEmbed = new EmbedBuilder()
      .setTitle(thing.name)
      .setURL(thing.url)
      .setAuthor({
        name: "Currently playing",
        iconURL: iconURL,
      })
      .setThumbnail(thing.image)
      .setDescription(`${thing.artist} in ${thing.album}`);

    await interaction
      .reply({
        embeds: [trackEmbed],
        withResponse: true,
      })
      .then((response) => console.log(response))
      .catch(console.error);
  },
};

export default slashCommand;
