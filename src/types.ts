import {
  type ChatInputCommandInteraction,
  type ClientEvents,
  Events,
  type Message,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type SlashCommand = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<string>;
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

export type BotEvent<T extends keyof ClientEvents> = {
  type: T;
  once?: boolean;
  execute: (...args: ClientEvents[T]) => void;
};

export const botEventGuard = (object: object) =>
  "type" in object && "execute" in object
  && Object.values(Events).includes(object.type as Events);

export type MaybePromiseVoid = void | Promise<void>;

export interface Track {
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
}

export interface LastFMTrack {
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
}

export interface LastFMData {
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
}
