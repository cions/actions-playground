import * as core from "@actions/core";

core.info("typescript-action: post.js is started");
core.info(`STATE_PRE = ${core.getState("STATE_PRE")}`);
core.info(`STATE_MAIN = ${core.getState("STATE_MAIN")}`);
