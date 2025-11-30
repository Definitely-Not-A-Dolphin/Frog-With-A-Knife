import { ActivityType, type Client, Events } from "discord.js";
import type { BotEvent } from "../types.ts";
import { getRandomEmoji } from "../utils.ts";

export const readyEvent: BotEvent = {
  type: Events.ClientReady,
  execute: (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity(
      getRandomEmoji(),
      {
        type: ActivityType.Custom,
      },
    );
  },
};
