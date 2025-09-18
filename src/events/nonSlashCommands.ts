import { EmbedBuilder, Events, type Message, TextChannel } from "discord.js";
import type { BotEvent, Track } from "$src/customTypes.ts";
import { db } from "$src/db.ts";
import { getPlayingTrack } from "$src/utils.ts";

function ping(message: Message): boolean {
  if (message.content !== ".ping") return false;
  const now = Date.now();
  const diff = now - message.createdTimestamp;
  console.log(`Pinged ${message.author.username} via message.`);
  message.reply(`Pong! Latency: ${diff}ms`);
  return true;
}

function hello(message: Message): boolean {
  if (message.content !== "Hello <@1363950316562944090>") return false;
  message.reply({
    content: `Hello <@${message.author.id}>!`,
  });
  return true;
}

async function np(message: Message): Promise<boolean> {
  if (message.content !== ".np") return false;

  const lastFMUsername: { "lastfm_username": string } | undefined = db
    .prepare("SELECT lastfm_username FROM lastfm WHERE user_id = ?")
    .get(message.author.id) ?? undefined;

  if (!lastFMUsername) {
    message.reply("You need to set a username first!");
    return true;
  }

  const thing: boolean | Track = await getPlayingTrack(
    lastFMUsername["lastfm_username"],
  );

  if (thing === false) {
    message.reply("Something went wrong fetching your data :/");
    return true;
  }

  if (thing === true) {
    message.reply("You are currently not listening to anything!");
    return true;
  }

  let iconURL = message.author.avatarURL();
  if (!iconURL) iconURL = message.author.defaultAvatarURL;

  const trackEmbed = new EmbedBuilder()
    .setTitle(thing.name)
    .setURL(thing.url)
    .setAuthor({
      name: "Currently playing",
      iconURL: iconURL,
    })
    .setThumbnail(thing.image)
    .setDescription(`${thing.artist} in ${thing.album}`);

  message.reply({
    embeds: [trackEmbed],
  });
  return true;
}

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: async (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    if (hello(message)) return;

    if (ping(message)) return;

    if (await np(message)) return;

    if (!message.member) return; // If message is not sent in a guild, return
  },
};

export default event;
