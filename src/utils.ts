import { secrets } from "./config.ts";
import type { lastFMData, lastFMTrack, Track } from "./customTypes.ts";

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

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
}

export async function getPlayingTrack(
  username: string,
): Promise<boolean | Track> {
  const baseUrl =
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${secrets.lastfmkey}&format=json`;

  const response = await fetch(baseUrl);

  if (!response.ok) {
    return false;
  }

  const lastFMData: lastFMData = await response.json();
  const dataIWant: lastFMTrack[] = lastFMData.recenttracks.track;

  if (
    dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"] ||
    !dataIWant[0]["@attr"].nowplaying
  ) {
    return true;
  }

  return {
    name: dataIWant[0].name,
    album: dataIWant[0].album["#text"],
    artist: dataIWant[0].artist["#text"],
    image: dataIWant[0].image[3]["#text"],
    url: dataIWant[0].url,
  };
}
