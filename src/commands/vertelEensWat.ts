import type { Message } from "discord.js";
import type { NonSlashCommand } from "../customTypes.ts";
import { env } from "../env.ts";

export type Repository = {
  id: number;
  name: string;
  ownerLogin: string;
  description: string;
  url: string;
  languages: Language;
  license?: {
    name: string;
  };
  stargazers_count: number;
};

// May not exactly match the github project response type.
export type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
};

export type Language = Record<string, number>;

export const vertelEensWat: NonSlashCommand = {
  match: (message: Message) =>
    Boolean(message.content.match(/vertel (een|i)s wat over jezelf/i)),
  execute: async (message: Message) => {
    const repositoryResponse = await fetch(
      "https://api.github.com/repositories/971248396",
      {
        method: "GET",
        headers: {
          access_token: env.GITHUB_TOKEN,
        },
      },
    );

    if (!repositoryResponse.ok) {
      await message.reply("Nee jij eerst");
      return;
    }

    // Request the repo with matching IDs
    const repositoryData: GitHubRepository = await repositoryResponse.json();

    console.log(
      `\x1b[44m > \x1b[0m Fetch Log: ${repositoryData.full_name}`,
      repositoryResponse.headers,
    );

    // Get the languages
    const languageResponse = await fetch(
      repositoryData.languages_url,
      {
        method: "GET",
        headers: {
          access_token: env.GITHUB_TOKEN,
        },
      },
    );

    if (!languageResponse.ok) {
      await message.reply("Nee jij eerst");
      return;
    }

    console.log(
      `\x1b[43m > \x1b[0m Fetch Log Languages: ${repositoryData.full_name}`,
      languageResponse.headers,
    );

    const rawLanguageData: Language = await languageResponse.json();

    // Aantal characters
    let totalCharacterCount = 0;
    for (const [, characterCount] of Object.entries(rawLanguageData)) {
      totalCharacterCount += characterCount;
    }

    const languageData: Language = {};
    for (const [language, charCount] of Object.entries(rawLanguageData)) {
      const percent = Math.floor(charCount / totalCharacterCount * 1000) / 10;
      // Equivalent of break as long as github doesn't switch the descending order of languages
      if (percent === 0) continue;
      languageData[language] = percent;
    }

    let languageMessage = "";
    for (const [language, percent] of Object.entries(languageData)) {
      languageMessage += `\t\t"${language}": "${percent}"\n`;
    }

    const responseMessage = "# Frog With A Knife!\n"
      + "That's me, that's right!"
      + "```json\n"
      + "{\n"
      + `\t"id": "${repositoryData.id}",\n`
      + `\t"name": "${repositoryData.name}",\n`
      + `\t"ownerLogin": "${repositoryData.owner.login}",\n`
      + `\t"description": "${repositoryData.description}",\n`
      + `\t"url": "${repositoryData.url}",\n`
      + '\t"languages": {\n'
      + languageMessage
      + "\t},\n"
      + `\t"license": {\n`
      + `\t\t"name": "${repositoryData.license?.name}"\n`
      + "\t},\n"
      + `\t"stargazers_count": ${repositoryData.stargazers_count}\n`
      + "}\n"
      + "\`\`\`";

    await message.reply(responseMessage);
  },
};
