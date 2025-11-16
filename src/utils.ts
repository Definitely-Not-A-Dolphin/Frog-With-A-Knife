import { EmbedBuilder } from "discord.js";
import { getAverageColor } from "fast-average-color-node";
import type { Track } from "./customTypes.ts";

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

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
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
