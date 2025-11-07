import { env } from "$src/config.ts";
import {
  type LastFMData,
  type LastFMTrack,
  type NonSlashCommand,
  NonSlashCommandGuard,
  type SlashCommand,
  SlashCommandGuard,
  type Track,
} from "$src/customTypes.ts";
import { EmbedBuilder } from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import fs from "node:fs";
import path from "node:path";

export function coolBanner(): void {
  console.log(
    " ______                __          ___ _   _                  _  __      _  __      \n" +
      "|  ____|               \\ \\        / (_) | | |         /\\     | |/ /     (_)/ _|    \n" +
      "| |__ _ __ ___   __ _   \\ \\  /\\  / / _| |_| |__      /  \\    | ' / _ __  _| |_ ___ \n" +
      "|  __| '__/ _ \\ / _` |   \\ \\/  \\/ / | | __| '_ \\    / /\\ \\   |  < | '_ \\| |  _/ _ \\\n" +
      "| |  | | | (_) | (_| |    \\  /\\  /  | | |_| | | |  / ____ \\  | . \\| | | | | ||  __/\n" +
      "|_|  |_|  \\___/ \\__, |     \\/  \\/   |_|\\__|_| |_| /_/    \\_\\ |_|\\_\\_| |_|_|_| \\___|\n" +
      "                 __/ |                                                             \n" +
      "                |___/                                                              \n",
  );
}

// Simple method that returns a random emoji from list
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max - min) + min;
}

export function arrayCount<T>(thing: T[], element: T): number {
  let count = 0;
  thing.forEach((x) => {
    if (x === element) count++;
  });
  return count;
}

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
}

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

const slashCommands: SlashCommand[] = [];
const nonSlashCommands: NonSlashCommand[] = [];

// Grabs all files in commands/slashCommands
const commandsPath: string = path.join(
  import.meta.dirname ?? "",
  "commands",
);
const commandFiles: string[] = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  console.log(path.join(commandsPath, file));
}

for (const file of commandFiles) {
  const filePath: string = path.join(commandsPath, file);
  console.log(`Current filePath: ${filePath}`);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (SlashCommandGuard(entry[1])) {
      console.log(`Added ${entry[0]} as SlashCommand`);
      slashCommands.push(entry[1] as SlashCommand);
      continue;
    }

    if (NonSlashCommandGuard(entry[1])) {
      console.log(`Added ${entry[0]} as NonSlashCommand`);
      nonSlashCommands.push(entry[1] as NonSlashCommand);
      continue;
    }

    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like a command..`,
    );
  }
}

console.log(slashCommands);
console.log(nonSlashCommands);

export { nonSlashCommands, slashCommands };
