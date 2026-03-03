import { ActivityType, type Client, Events, TextChannel } from "discord.js";
import db from "../db.ts";
import { BotEvent } from "../types.ts";
import { getRandomEmoji, sleep } from "../utils.ts";

interface MipoEntry {
  mipoId: number;
  messageId: string;
  channelId: string;
  userId: string;
  guildId: string;
  timestamp: number;
}

async function awardMipo(client: Client<true>): Promise<void> {
  const guilds = (await client.guilds.fetch()).values();

  while (true) {
    const today = new Date();
    today.setDate(today.getDate());
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msTillNextDay = Math.floor(tomorrow.getTime() - new Date().getTime());

    // After the wait, award
    await sleep(msTillNextDay);

    for (const guild of guilds) {
      const rawMipoData = db.sql`
        SELECT * FROM mipo
        WHERE guildId = ${guild.id} AND ${today.getTime()} < timestamp AND timestamp < ${tomorrow.getTime()}
      ` as MipoEntry[];

      const mipoData = rawMipoData.sort((entry, nextEntry) =>
        entry.timestamp - nextEntry.timestamp
      );

      if (mipoData.length === 2) {
        db.sql`
          INSERT INTO mipoints (userId, messageId, guildId, timestamp)
          VALUES (${client.user.id}, 0, ${guild.id}, ${Date.now()})
        `;

        const channel = await client.channels.fetch(mipoData[0].channelId);
        if (!channel || !(channel instanceof TextChannel)) return;
        const message = await channel.messages.fetch(mipoData[0].messageId);

        await message.reply(`w00t <@${client.user.id}>!`);
      } else if (mipoData.length % 2 !== 0) {
        const mipo = mipoData[(mipoData.length - 1) / 2];

        db.sql`
          INSERT INTO mipoints (userId, guildId, timestamp)
          VALUES (${mipo.userId}, ${mipo.guildId}, ${Date.now()})
        `;

        const channel = await client.channels.fetch(mipoData[0].channelId);
        if (!channel || !(channel instanceof TextChannel)) return;
        const message = await channel.messages.fetch(mipoData[0].messageId);

        await message.reply(`w00t <@${mipo.userId}>!`);
      } else {
        // Oh boy this gets very complicated.
        let averageTime = 0;
        for (const { timestamp } of mipoData) averageTime += timestamp;
        averageTime /= mipoData.length;

        // Get the two tied mipos, then check which one
        // was sent closest to the average time of the day
        const [mipo1, mipo2] = mipoData.slice(
          mipoData.length / 2 - 1,
          mipoData.length / 2,
        );

        const mipo = Math.abs(mipo1.timestamp - averageTime)
            < Math.abs(mipo2.timestamp - averageTime)
          ? mipo1
          : mipo2;

        db.sql`
          INSERT INTO mipoints (userId, guildId, timestamp)
          VALUES (${mipo1.userId}, ${mipo.guildId}, ${Date.now()})
        `;

        const channel = await client.channels.fetch(mipo.channelId);
        if (!channel || !(channel instanceof TextChannel)) return;
        const message = await channel.messages.fetch(mipo.messageId);

        await message.reply(`w00t <@${mipo.userId}>!`);
      }
    }
  }
}

export const clientReadyEvent = new BotEvent<Events.ClientReady>({
  type: Events.ClientReady,
  once: true,
  execute: async (client: Client<true>) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity(
      `testing in production ${getRandomEmoji()}`,
      {
        type: ActivityType.Custom,
      },
    );

    await awardMipo(client);
  },
});
