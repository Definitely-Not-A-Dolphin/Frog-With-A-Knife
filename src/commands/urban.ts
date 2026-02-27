import { EmbedBuilder } from "discord.js";
import type { NonSlashCommand } from "../types.ts";

interface UrbanDictionaryEntry {
  author: string;
  current_vote: string;
  defid: number;
  definition: string;
  example: string;
  permalink: string;
  thumbs_down: number;
  thumbs_up: number;
  word: string;
  written_on: string;
}

interface UrbanDictionaryResponse {
  list: UrbanDictionaryEntry[];
}

export const urbanDictionary: NonSlashCommand = {
  name: "urban dictionary",
  command: /;u(d|rban)/i,
  description: "get a definition from the urban dictionary",
  showInHelp: true,
  match: (message) =>
    Boolean(message.content.split(" ")[0].match(urbanDictionary.name)),
  execute: async (message) => {
    const givenWord = message.content.split(" ")[1];

    if (!givenWord) {
      await message.reply("geef dan ook een woord jij vage kennis");
      return `${message.author.username} used .ud [], but failed to supply a word`;
    }

    const urbanDictionaryResponse: Response = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${givenWord}`,
    );

    if (!urbanDictionaryResponse.ok) {
      await message.reply("Oopsie, something went wrong");
      return `${message.author.username} used .ud ${givenWord}, but something went wrong`;
    }

    const responseData: UrbanDictionaryResponse = await urbanDictionaryResponse
      .json();

    if (!responseData.list[0]) {
      await message.reply("Definition not found :\\");
      return `${message.author.username} used .ud [${givenWord}], but no definition was found`;
    }

    const { author, definition, permalink, thumbs_down, thumbs_up, word }:
      UrbanDictionaryEntry = responseData.list[0];

    const udEmbed = new EmbedBuilder()
      .setTitle(word)
      .setDescription(definition)
      .setURL(permalink)
      .setFooter({
        text: `By ${author}\n👍 ${thumbs_up} | 👎 ${thumbs_down}`,
      })
      .setThumbnail("https://cdn.elisaado.com/ud_logo.jpeg")
      .setColor(0xf2fd60);

    await message.reply({
      embeds: [udEmbed],
    });
    return `${message.author.username} used .ud [${word}]`;
  },
};
