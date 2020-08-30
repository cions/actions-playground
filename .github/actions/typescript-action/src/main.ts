import * as core from "@actions/core";
import { printEnvvars, printContexts, testAction } from "./lib.js";

async function main(): Promise<void> {
  const action = core.getInput("action", { required: true });

  switch (action) {
    case "print-envvars":
      printEnvvars();
      break;
    case "print-contexts":
      printContexts();
      break;
    case "test-action":
      await testAction();
      break;
    default:
      throw new Error(`unknown action: ${action}`);
  }
}

try {
  await main();
} catch (error: unknown) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("unknown error");
  }
}
