import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Collection,
  Events,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { Message } from "discord.js";

declare module "discord.js" {
  // Adds the type for the client.command object
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

export type SlashCommand = {
  // This is a slash command. every .ts file in src/commands should export default this
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder; // there are multiple kinds of slashcommand builders
  execute: (interaction: ChatInputCommandInteraction) => void; // the function that runs when the slashcommand is being executed
  autocomplete?: (interaction: AutocompleteInteraction) => void; // optional autocomplete function
};

export const SlashCommandGuard = (
  object: object, // this checks if an object is a slashcommand
) =>
  "data" in object &&
  "execute" in object;

export type NonSlashCommand = {
  keyword: string;
  execute: (message: Message) => void;
};

export const NonSlashCommandGuard = (
  object: object,
) => "keyword" in object && "execute" in object;

export type BotEvent = {
  // botevent, these reside in src/events/*.ts
  type: Events;
  once?: boolean;

  // deno-lint-ignore no-explicit-any
  execute: (...args: any[]) => void; // Man, not my fault discordjs uses any even in their god damn type.
};

export const BotEventGuard = (
  object: object, // again, checks if an object is a botevent
) =>
  "default" in object &&
  "type" in (object.default as object) &&
  "execute" in (object.default as object);

export type Track = {
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
};

export type lastFMTrack = {
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
};

export type lastFMData = {
  recenttracks: {
    track: lastFMTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
};
