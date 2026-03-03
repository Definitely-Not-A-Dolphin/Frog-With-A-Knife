import type { MaybePromiseVoid } from "./types.ts";

const handlers: (() => MaybePromiseVoid)[] = [];

export const addSigListener = (fun: () => MaybePromiseVoid): void => {
  handlers.push(fun);
};

const sigHandler = async () => {
  console.log("Shutting down...");
  for await (const handler of handlers) handler();

  Deno.exit();
};

if (Deno.build.os !== "windows") Deno.addSignalListener("SIGTERM", sigHandler);
// Windows momentje
Deno.addSignalListener("SIGINT", sigHandler);
