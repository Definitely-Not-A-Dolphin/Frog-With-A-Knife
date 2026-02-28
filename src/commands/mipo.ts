import { type Message, MessageFlags } from "discord.js";
import db from "../db.ts";
import env from "../env.ts";
import type { NonSlashCommand } from "../types.ts";

export interface MipointEntry {
  mipointId: number;
  userId: string;
  guildId: string;
  timestamp: number;
}

const channels = env.MIPO_CHANNELS.split(",").map((id) => id.trim());

export const mipo: NonSlashCommand = {
  name: "mipo",
  command: ";mipo",
  description: "doe de mipo!",
  showInHelp: true,
  match: (message: Message) => message.content === mipo.command,
  execute: async (message: Message) => {
    if (!channels.includes(message.channelId)) {
      await message.reply("mipo MIJN REET");
      return `${message.author.username} tried mipo where it isn't allowed`;
    }

    db.sql`
      INSERT INTO mipo (userId, guildId, timestamp)
      VALUES (
        ${message.author.id},
        ${message.guild?.id ?? 0},
        ${message.createdTimestamp}
      );
    `;

    // If this line appears unfinished, its because
    // your font can't render the emoji and panics
    await message.react("🔪");
    return `${message.author.username} did a mipo`;
  },
};

export const mipoStats: NonSlashCommand = {
  name: "mipostats",
  command: ";mipostats",
  description: "Check the mipostats",
  showInHelp: true,
  match: (message) => message.content === mipoStats.command,
  execute: async (message) => {
    if (!message.guild) return;

    const rawMipointsData = db.sql`
      SELECT * FROM mipoints
      WHERE guildId = ${message.guild.id}
    ` as MipointEntry[];

    const userIds = rawMipointsData.map((entry) => entry.userId) as string[];

    // Maps userId to displayName
    const members = Object.fromEntries(
      (await message.guild.members.fetch({
        user: userIds,
      })).map((member) => [member.id, member.displayName]),
    );

    let mipointData: Record<string, number> = {};

    for (const { userId } of rawMipointsData) {
      const displayName = members[userId];
      if (mipointData[displayName]) mipointData[displayName] += 1;
      else mipointData[displayName] = 1;
    }

    // Sorts it
    mipointData = Object.fromEntries(
      Object.entries(mipointData).sort((a, b) => b[1] - a[1]),
    );

    let highestCount = "0";
    for (const count of Object.values(mipointData)) {
      if (count > Number(highestCount)) highestCount = String(count);
    }

    let replyMessage = "# :3 stats\n```\n";

    let first = true;
    for (const [name, count] of Object.entries(mipointData)) {
      replyMessage += `${first ? "╭" : "├"}─ ${count}${
        " ".repeat(highestCount.length - String(count).length + 1)
      }: ${name}\n`;

      first = false;
    }

    replyMessage += "```";

    await message.reply({
      content: replyMessage,
      flags: MessageFlags.SuppressNotifications,
    });
    return `${message.author.username} user :3stats`;
  },
};
