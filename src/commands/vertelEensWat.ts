import type {
  GitHubRepository,
  Language,
  NonSlashCommand,
  OctokitResponse,
} from "../customTypes.ts";
import { env } from "../env.ts";
import type { Message } from "discord.js";
import { Octokit } from "octokit";

export const vertelEensWat: NonSlashCommand = {
  match: (message: Message) =>
    Boolean(/(V|v)ertel (een|i)s wat over jezelf/g.exec(message.content)),
  execute: async (message: Message): Promise<void> => {
    const octokit: Octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    });

    const repoData: OctokitResponse<GitHubRepository> = await octokit
      .request(
        "GET /repos/Definitely-Not-A-Dolphin/Frog-With-A-Knife/",
      );

    // Get the languages
    const rawLanguageData: OctokitResponse<Language[]> = await octokit
      .request(
        "GET /repos/Definitely-Not-A-Dolphin/Frog-With-A-Knife/languages",
      );

    console.log(
      `\x1b[44m > \x1b[0m Fetch Log\n`,
      repoData.headers,
      "\n",
      `\x1b[43m > \x1b[0m Fetch Log Languages\n`,
      rawLanguageData.headers,
    );

    const languageData: Language = {};
    let totalChar: number = 0;

    for (const language of Object.entries(rawLanguageData.data)) {
      totalChar += Number(language[1]);
    }

    for (const language of Object.entries(rawLanguageData.data)) {
      const thing: number = Math.floor(Number(language[1]) / totalChar * 1000)
        / 10;
      if (thing === 0) continue;
      // Equivalent of break as long as github doesn't switch the descending order of languages

      languageData[language[0]] = thing;
    }

    let languageMessage: string = "";
    for (const languageEntry of Object.entries(languageData)) {
      languageMessage += `\t\t${languageEntry[0]}: "${languageEntry[1]}"\n`;
    }

    const responseMessage: string = "# Frog With A Knife!\n"
      + "That's me, that's right!"
      + "\`\`\`json\n"
      + "{\n"
      + "\tid: "
      + repoData.data.id
      + ",\n"
      + "\tname: "
      + repoData.data.name
      + ",\n"
      + "\townerLogin: "
      + repoData.data.owner.login
      + ",\n"
      + "\tdescription: "
      + repoData.data.description!
      + ",\n"
      + "\turl: "
      + repoData.data.url
      + ",\n"
      + "\tlanguages: {\n"
      + languageMessage
      + "\t},\n"
      + "\tlicense: {\n"
      + "\t\tname: "
      + repoData.data.license?.name
      + "\n"
      + "\t},\n"
      + "\tstargazers_count: "
      + repoData.data.stargazers_count
      + "\n"
      + "}\n"
      + "\`\`\`";

    message.reply(responseMessage);
  },
};
