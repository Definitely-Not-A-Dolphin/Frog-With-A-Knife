import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import type { SlashCommand } from "../customTypes.ts";
import { db } from "../db.ts";

export const slashQuoteUpload: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("quote-upload")
    .setDescription("upload a quote!")
    .addStringOption((option) =>
      option
        .setName("what")
        .setDescription("Set the quote")
        .setRequired(true)
    ).addStringOption((option) =>
      option
        .setName("who")
        .setDescription("which mastermind said this?")
        .setRequired(false)
        .setAutocomplete(true)
    ).addStringOption((option) =>
      option
        .setName("when")
        .setDescription("when was it said?")
        .setRequired(false)
    ).addStringOption((option) =>
      option
        .setName("context")
        .setDescription("in what context?")
        .setRequired(false)
    ),
  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> => {
    const what = interaction.options.getString("what", true);
    const who: string | null = interaction.options.getString("who");
    const when: string | null = interaction.options.getString("when");
    const context: string | null = interaction.options.getString("context");

    try {
      db.prepare(
        "INSERT INTO quotes (what, who, date, context) VALUES (?, ?, ?, ?)",
      ).get(what, who, when, context);
    } catch (err) {
      console.error(err);
    }

    let message = `> ${what}\n\n`;
    if (who) message += `By ${who} | `;
    if (what) message += `At ${when}\n`;
    if (context) message += context;

    console.log(
      `\x1b[31m > \x1b[0m ${interaction.user.username} used /quote-upload`,
    );
    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .catch((err) => console.error(err));
  },
  autocomplete: async (interaction) => {
    const focusedValue: string = interaction.options.getFocused();
    const who: Record<string, string>[] =
      db.sql`SELECT DISTINCT who FROM quotes`
        ?? { who: "Niemand :(" };

    const thing: string[] = [];
    for (const i of who) if (i["who"]) thing.push(i["who"]);

    const filtered: string[] = Object.values(thing).filter((choice) =>
      choice.toLowerCase().startsWith(focusedValue.toLowerCase())
    );
    await interaction.respond(
      filtered.map((choice: string) => ({ name: choice, value: choice })).slice(
        0,
        24,
      ), // maximum of 24 items for autocomplete or smt
    );
  },
};
