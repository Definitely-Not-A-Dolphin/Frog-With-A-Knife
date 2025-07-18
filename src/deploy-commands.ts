import { REST, Routes } from "discord.js";
import config from "../config.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";

const commands: never[] = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath: string = path.join(import.meta.dirname, "commands");
const commandFolders: string[] = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath: string = path.join(commandsPath, file);
    const command: any = await import(`file:///${filePath}`);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest: REST = new REST().setToken(config.token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
