import { type Message, MessageFlags } from "discord.js";
import type { NonSlashCommand } from "../types.ts";
import { db } from "../db.ts";

export const kitty: NonSlashCommand = {
  name: ":3",
  command: ":3",
  description: "oh nothing",
  showInHelp: false,
  match: (message: Message) =>
    message.content.includes(":3") && message.content !== ":3stats"
    && !message.author.bot,
  execute: async (message: Message) => {
    let kittyCount: number | undefined = db.sql`
      SELECT * FROM kitty WHERE userId = ${message.author.id};
    `[0]?.kittyCount;

    if (kittyCount === undefined) {
      db.sql`INSERT INTO kitty (userId, kittyCount) VALUES (${message.author.id}, 0);`;
      kittyCount = 0;
    }
    db.sql`
      UPDATE kitty
      SET kittyCount = ${kittyCount + 1}
      WHERE userId = ${message.author.id}
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
  match: (message: Message) => message.content === kittyStats.command,
  execute: async (message: Message) => {
    if (!message.guild) return;

    const rawKittyCount: Record<string, number>[] = db.sql`
      SELECT * FROM kitty WHERE userId = ${message.author.id}`;

    let kittyCount: Record<string, number> = {};
    for (const entry of rawKittyCount) {
      kittyCount[entry.userId] = entry.kittyCount;
    }
    kittyCount = Object.fromEntries(
      Object.entries(kittyCount).sort((a, b) => b[1] - a[1]),
    );

    const members = await message.guild.members.fetch({
      user: Object.keys(kittyCount),
    });

    let longestUsernameLength = 0;
    for (const key of Object.keys(kittyCount)) {
      const member = members.get(key);
      if (!member) continue;
      if (
        longestUsernameLength < member.displayName.length
      ) {
        longestUsernameLength = member.displayName.length;
      }
    }

    let replyMessage = "# :3 stats\n```\n";
    for (const [id, count] of Object.entries(kittyCount)) {
      const name = members.get(id)?.displayName;
      if (!name) continue;
      replyMessage += name + " ".repeat(longestUsernameLength - name.length + 4)
        + `: ${count}\n`;
    }

    replyMessage += "```";

    await message.reply({
      content: replyMessage,
      flags: MessageFlags.SuppressNotifications,
    });
    return `${message.author.username} user :3stats`;
  },
};
