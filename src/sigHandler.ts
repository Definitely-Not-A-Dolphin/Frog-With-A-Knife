import type { MaybePromiseVoid } from "./customTypes.ts";

let handlers: (() => MaybePromiseVoid)[] = [];

export const addSigListener = (fun: () => MaybePromiseVoid) => {
  handlers.push(fun);
};
export const removeSigListener = (fun: () => MaybePromiseVoid) => {
  handlers = handlers.filter((v) => v === fun);
};

const sigHandler = async () => {
  console.log("Shutting down...");
  for (const i of handlers) {
    await i();
  }

  Deno.exit();
};

if (Deno.build.os !== "windows") {
  Deno.addSignalListener("SIGTERM", sigHandler);
}

Deno.addSignalListener("SIGINT", sigHandler);
