import { Events } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";

const event: BotEvent = {
  type: Events.ClientReady,
  execute: (client): void => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

export default event;
