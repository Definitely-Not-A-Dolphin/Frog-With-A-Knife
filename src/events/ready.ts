import { ActivityType, type Client, Events } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";
import { getRandomEmoji } from "../utils.ts";

export const readyEvent: BotEvent = {
  type: Events.ClientReady,
  execute: (client: Client<boolean>): void => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity(
      getRandomEmoji(),
      {
        type: ActivityType.Custom,
      },
    );
  },
};
