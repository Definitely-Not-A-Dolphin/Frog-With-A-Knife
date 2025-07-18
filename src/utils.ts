import "dotenv/config";

export async function DiscordRequest(endpoint: string, options: any) {
  // append endpoint to root API URL
  const url: string = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res: Response = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data: any = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple Function that returns a random emoji from list
export function getRandomEmoji(): string {
  const emojiList = [":)", ":|", ":(", ":D", ":P", ";)", ":O", ":S", ":X", ":$", ":@", ":#", ":&", ":!", ":?", ":~", ":^)", ":-)", ":-|", ":-(", ":-D", ":-P", ";-)", ":-O", ":-S", ":-X", ":-$", ":-@", ":-#", ":-&", ":-!", ":-?", ":-~", ":-^)", "^_^", "o_O", "O_o", "T_T", "XD", "xD", ":3", ":c", ":v", ":]", ":["];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
