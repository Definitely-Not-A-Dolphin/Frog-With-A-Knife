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
      await message.reply({
        content: "Dan moet je ook wel iets quoten jij sukkel",
      });
      return `${message.author.displayName} didn't quote anyone`;
    }

    const repliedToMessage = await message.fetchReference();
    const content =
      `> ${repliedToMessage.content}\n\~ <@${repliedToMessage.author.id}>`;

    await message.reply(content);
    return `${message.author.displayName} used ;quote on ${repliedToMessage.author.displayName}: Command successful.`;
  },
});
