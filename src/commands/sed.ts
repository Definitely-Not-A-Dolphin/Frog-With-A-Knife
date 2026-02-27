import type { NonSlashCommand } from "../types.ts";

// uniflex thank you for this code, i don't know regex well enough to do this completely on my own :)

export const sed: NonSlashCommand = {
  name: "sed",
  command: /^`?\;sed`?\/`?(\\.|[^\/])*\/(\\.|[^\/])*?(\/.*?)?`?$/,
  description: "replace text and make someone look bad",
  showInHelp: true,
  match: (message) => Boolean(message.content.match(sed.command)),
  execute: async (message) => {
    if (
      !(message.reference && message.reference.messageId && !message.author.bot)
    ) {
      await message.reply("Something went wrong :(");
      return `${message.author.username} used ${message.content}`;
    }

    const match = message.content.match(
      /^`?\;sed`?\/`?((?:\\.|[^\/])*)\/((?:\\.|[^\/])*?)(\/(.*?))?`?$/,
    ) as RegExpMatchArray;
    const [, find, replace, , options] = match;

    if (
      options && (
        options.match(/[^gmidsuvy]/)
        || new Set(options.split("")).size !== options.split("").length
      )
    ) {
      await message.reply("You made an oopsie with the regex options");
      return `${message.author.username} used ;sed, but made an oopsie with the regex options`;
    }

    const reply = message.channel.messages.cache.get(
      message.reference.messageId,
    );

    if (!reply || reply.author.bot) {
      await message.reply("Something went wrong :(");
      return `${message.author.username} used ;sed, but something went wrong`;
    }

    const oldContent = reply.content || reply.embeds[0].description || "";
    const newContent = oldContent.replace(
      new RegExp(find, options ?? "g"),
      replace.replace(/\\(.)/g, "$1"),
    );

    if (newContent.length > 1000) {
      message.reply("Resulting message is te lang aapje");
      return `${message.author.username} used ;sed, but the resulting message was too long`;
    }

    reply.reply({
      allowedMentions: { repliedUser: false },
      content: newContent + `\n-# \`${message.content}\``,
    });
    return `${message.author.username} used ${message.content}`;
  },
};
