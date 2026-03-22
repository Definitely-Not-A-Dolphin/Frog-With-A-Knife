import { TextChannel } from "discord.js";
import db from "../db.ts";
import { NonSlashCommand } from "../types.ts";

export const quote = new NonSlashCommand({
  name: "quote",
  command: ";quote",
  description: "quote someone",
  showInHelp: true,
  match(message): boolean {
    return message.content === this.command;
  },
  async execute(message): Promise<string> {
    const reference = message.reference;

    if (!reference) {
      await message.reply("Dan moet je ook wel iets quoten jij sukkel");
      return `${message.author.displayName} didn't quote anyone`;
    }

    const repliedToMessage = await message.fetchReference();

    const content =
      `> ${repliedToMessage.content}\n\~ <@${repliedToMessage.author.id}>`;

    const channelId = db.sql`
      SELECT * FROM quoteChannels WHERE guildId = ${message.guildId};
    `[0].guildId as string | null;

    if (!channelId) {
      await message.reply(content);
    } else {
      const channel = await message.guild.channels.fetch(channelId);

      if (!(channel && channel instanceof TextChannel)) {
        await message.reply("oke wtf waar is de quotes channel sis");
        return `${message.author.discriminator} tried to quote, but the channel was gone.`;
      }

      channel.send(content);
    }
    return `${message.author.displayName} quoted ${repliedToMessage.author.displayName}`;
  },
});

export const setQuoteChannel = new NonSlashCommand({
  name: "setQuoteChannel",
  command: ";setQuoteChannel",
  description: "set the quote channel",
  showInHelp: true,
  match(message): boolean {
    return message.content === this.command;
  },
  async execute(message): Promise<string> {
    if (!(message.channel instanceof TextChannel)) {
      await message.reply("this channel isnt valid sis");
      return `${message.author.displayName} tried to set a quotes channel somewhere invalid.`;
    }

    try {
      db.sql`DELETE FROM quoteChannels WHERE guildId = ${message.guildId}`;

      db.sql`
        INSERT INTO quoteChannels (guildId, channelId) VALUES (${message.guildId}, ${message.channelId})`;
    } catch (err) {
      console.error(err);
      await message
        .reply("Something went wrong!")
        .catch((err) => console.error(err));
      return `${message.author.username} used ;setQuoteChannel [${message.channelId}], but something went wrong`;
    }

    await message.reply(
      `New quote channel is <#${message.channelId}>`,
    );
    return `${message.author.username} used ;setQuoteChannel [${message.channelId}]`;
  },
});
