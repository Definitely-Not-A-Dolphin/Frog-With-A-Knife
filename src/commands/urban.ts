import { EmbedBuilder, type Message } from "discord.js";
import type { NonSlashCommand } from "../types.ts";

export type UrbanDictionaryEntry = {
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
};

export type UrbanDictionaryResponse = {
  list: UrbanDictionaryEntry[];
};

export const urbanDictionary: NonSlashCommand = {
  name: "urban dictionary",
  command: /\.u(d|rban)/i,
  description: "get a definition from the urban dictionary",
  showInHelp: true,
  match: (message: Message) =>
    Boolean(message.content.split(" ")[0].match(urbanDictionary.name)),
  execute: async (message: Message) => {
    const word = message.content.split(" ")[1];

    if (!word) {
      await message.reply("geef dan ook een woord jij vage kennis");
      return `${message.author.username} used .ud [], but failed to supply a word`;
    }

    const response: Response = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${word}`,
    );

    if (!response.ok) {
      await message.reply("Oopsie, something went wrong");
      return `${message.author.username} used .ud ${word}, but something went wrong`;
    }

    const responseData: UrbanDictionaryResponse = await response.json();

    if (!responseData.list[0]) {
      await message.reply("Definition not found :\\");
      return `${message.author.username} used .ud [${word}], but no definition was found`;
    }

    const dataIWant: UrbanDictionaryEntry = responseData.list[0];

    const udEmbed = new EmbedBuilder()
      .setTitle(dataIWant.word)
      .setDescription(dataIWant.definition)
      .setURL(dataIWant.permalink)
      .setFooter({
        text:
          `By ${dataIWant.author}\n👍 ${dataIWant.thumbs_up} | 👎 ${dataIWant.thumbs_down}`,
      })
      .setThumbnail("https://cdn.elisaado.com/ud_logo.jpeg")
      .setColor(0xf2fd60);

    await message.reply({
      embeds: [udEmbed],
    });
    return `${message.author.username} used .ud [${word}]`;
  },
};
