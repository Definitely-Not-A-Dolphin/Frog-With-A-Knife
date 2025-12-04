export const coolBanner =
  " ______                __          ___ _   _                  _  __      _  __      \n"
  + "|  ____|               \\ \\        / (_) | | |         /\\     | |/ /     (_)/ _|    \n"
  + "| |__ _ __ ___   __ _   \\ \\  /\\  / / _| |_| |__      /  \\    | ' / _ __  _| |_ ___ \n"
  + "|  __| '__/ _ \\ / _` |   \\ \\/  \\/ / | | __| '_ \\    / /\\ \\   |  < | '_ \\| |  _/ _ \\\n"
  + "| |  | | | (_) | (_| |    \\  /\\  /  | | |_| | | |  / ____ \\  | . \\| | | | | ||  __/\n"
  + "|_|  |_|  \\___/ \\__, |     \\/  \\/   |_|\\__|_| |_| /_/    \\_\\ |_|\\_\\_| |_|_|_| \\___|\n"
  + "                 __/ |                                                             \n"
  + "                |___/                                                              \n";

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * max - min + 1) + min;

export function getRandomEmoji(): string {
  const smileys = [":)", ":D", ":3", ":P"] as const;
  return smileys[randomNumber(0, smileys.length - 1)];
}
