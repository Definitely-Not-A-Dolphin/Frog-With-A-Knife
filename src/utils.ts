import type { LastFMData, LastFMTrack, Track } from "$src/customTypes.ts";
import { EmbedBuilder } from "discord.js";
import { env } from "$src/config.ts";
import { getAverageColor } from "fast-average-color-node";

export function coolBanner(): void {
  console.log(
    " ______                __          ___ _   _                  _  __      _  __      \n"
      + "|  ____|               \\ \\        / (_) | | |         /\\     | |/ /     (_)/ _|    \n"
      + "| |__ _ __ ___   __ _   \\ \\  /\\  / / _| |_| |__      /  \\    | ' / _ __  _| |_ ___ \n"
      + "|  __| '__/ _ \\ / _` |   \\ \\/  \\/ / | | __| '_ \\    / /\\ \\   |  < | '_ \\| |  _/ _ \\\n"
      + "| |  | | | (_) | (_| |    \\  /\\  /  | | |_| | | |  / ____ \\  | . \\| | | | | ||  __/\n"
      + "|_|  |_|  \\___/ \\__, |     \\/  \\/   |_|\\__|_| |_| /_/    \\_\\ |_|\\_\\_| |_|_|_| \\___|\n"
      + "                 __/ |                                                             \n"
      + "                |___/                                                              \n",
  );
}

// Simple method that returns a random emoji from list
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max - min) + min;
}

export function arrayCount<T>(thing: T[], element: T): number {
  let count: number = 0;
  for (const anotherThing of thing) {
    if (anotherThing === element) count++;
  }
  return count;
}

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
}

export async function getPlayingTrack(
  username: string,
): Promise<boolean | Track> {
  const baseUrl: string =
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${env.LASTFM_KEY}&format=json`;

  const response: Response = await fetch(baseUrl);

  if (!response.ok) {
    console.log(
      `Last.fm response code: ${response.status}`,
      "\n",
      response.url,
    );
    return false;
  }

  const lastFMData: LastFMData = await response.json();
  const dataIWant: LastFMTrack[] = lastFMData.recenttracks.track;

  if (
    dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"]
    || !dataIWant[0]["@attr"].nowplaying
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
  const avgColor = await getAverageColor(
    trackPlaying.image,
  );
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
