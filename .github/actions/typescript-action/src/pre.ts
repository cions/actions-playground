import * as core from "@actions/core";

const action = core.getInput("action", { required: true });

if (action !== "test-action") {
  process.exit(0);
}

core.info("typescript-action: pre.js is started");
core.saveState("STATE_PRE", "value");
