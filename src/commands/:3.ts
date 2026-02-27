import { MessageFlags } from "discord.js";
import db from "../db.ts";
import type { NonSlashCommand } from "../types.ts";

interface MeowEntry {
  meowId: number;
  userId: string;
  guildId: string;
  timestamp: string;
}

export const kitty: NonSlashCommand = {
  name: ":3",
  command: ":3",
  description: "oh nothing",
  showInHelp: false,
  match: (message) =>
    message.content.includes(":3") && message.content !== ":3stats"
    && !message.author.bot,
  execute: async (message) => {
    db.sql`
      INSERT INTO meow (userId, guildId, timestamp)
      VALUES (${message.author.id}, ${message.guild?.id ?? 0}, ${Date.now()});
    `;

    await message.reply(":3");
    return `${message.author.username} did a :3`;
  },
};

export const kittyStats: NonSlashCommand = {
  name: ":3stats",
  command: ":3stats",
  description: "Check the :3stats",
  showInHelp: true,
  match: (message) => message.content === kittyStats.command,
  execute: async (message) => {
    if (!message.guild) return;

    const rawMeowData = db.sql`
      SELECT * FROM meow
      WHERE guildId = ${message.guild.id}
    ` as MeowEntry[];

    console.log(rawMeowData);

    const userIds = rawMeowData.map((entry) => entry.userId) as string[];

    // Maps userId to displayName
    const members = Object.fromEntries(
      (await message.guild.members.fetch({
        user: userIds,
      })).map((member) => [member.id, member.displayName]),
    );

    let meowData: Record<string, number> = {};

    for (const { userId } of rawMeowData) {
      const displayName = members[userId];
      if (meowData[displayName]) meowData[displayName] += 1;
      else meowData[displayName] = 1;
    }

    // Sorts it
    meowData = Object.fromEntries(
      Object.entries(meowData).sort((a, b) => b[1] - a[1]),
    );

    let highestCount = "0";
    for (const count of Object.values(meowData)) {
      if (count > Number(highestCount)) highestCount = String(count);
    }

    let replyMessage = "# :3 stats\n```\n";

    let first = true;
    for (const [name, count] of Object.entries(meowData)) {
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
