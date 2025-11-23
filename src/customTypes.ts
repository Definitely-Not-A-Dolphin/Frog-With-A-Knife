import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Events,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type SlashCommand = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
};

export const slashCommandGuard = (object: object) =>
  "data" in object && "execute" in object;

export type NonSlashCommand = {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => Promise<string | void>;
};

export const nonSlashCommandGuard = (object: object) =>
  "match" in object && "execute" in object;

export type BotEvent = {
  type: Events;
  once?: boolean;
  // deno-lint-ignore no-explicit-any
  execute: (...args: any[]) => void;
  // Unfortunately, we have to use any here, because the parameters of Events can be everything
};

export const botEventGuard = (object: object) =>
  "type" in object && "execute" in object;

export type MaybePromiseVoid = void | Promise<void>;

export type Track = {
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
};

export type LastFMTrack = {
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

export type LastFMData = {
  recenttracks: {
    track: LastFMTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
};
