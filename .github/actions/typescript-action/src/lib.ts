import * as path from "node:path";
import * as core from "@actions/core";
import * as github from "@actions/github";

export function printEnvvars(): void {
  const keys = Object.keys(process.env).sort();
  for (const key of keys) {
    const value = process.env[key] ?? "";
    if (value.split(path.delimiter).every((x) => path.isAbsolute(x))) {
      const formatted = value.replaceAll(
        path.delimiter,
        path.delimiter + "\n" + " ".repeat(key.length + 1),
      );
      process.stdout.write(`${key}=${formatted}\n`);
    } else {
      process.stdout.write(`${key}=${value}\n`);
    }
  }
}

export function printContexts(): void {
  const contexts = core.getInput("contexts", { required: true }).split(",");
  for (const name of contexts) {
    const context: unknown = JSON.parse(process.env[`${name.toUpperCase()}_CONTEXT`] ?? "null");
    process.stdout.write(`${name} = ${JSON.stringify(context, null, 2)}\n`);
  }
}

export async function testAction(): Promise<void> {
  process.stdout.write(`process.version = ${process.version}\n`);
  process.stdout.write(`process.argv0 = ${JSON.stringify(process.argv0)}\n`);
  process.stdout.write(`process.argv = ${JSON.stringify(process.argv)}\n`);
  process.stdout.write(`process.execPath = ${JSON.stringify(process.execPath)}\n`);
  process.stdout.write(`process.execArgv = ${JSON.stringify(process.execArgv)}\n`);

  process.stdout.write(`core.isDebug() = ${core.isDebug().toString()}\n`);
  core.debug("debug message");
  core.info("info message");
  core.notice("notice message");
  core.warning("warning message");
  core.error("error message");

  core.setOutput("output", "TypeScript Action output");
  core.exportVariable("TYPESCRIPT_ENV", "value");
  core.addPath(`${process.env.GITHUB_WORKSPACE ?? ""}/typescript`);
  core.setSecret("secrettoken");

  core.info(`STATE_PRE = ${core.getState("STATE_PRE")}`);
  core.saveState("STATE_MAIN", "value");

  const idToken = await core.getIDToken();
  core.info(`core.getIDToken() = ${idToken}`);

  core.startGroup("Print github.context");
  core.info(JSON.stringify(github.context, null, 2));
  core.endGroup();

  await core.group("octokit", async () => {
    const token = core.getInput("github-token", { required: true });
    const client = github.getOctokit(token);

    const repo = await client.rest.repos.get(github.context.repo);
    core.info(`repo = ${JSON.stringify(repo, null, 2)}`);

    const query = `
    query($login: String!) {
      user(login: $login) {
        login
        name
        location
      }
    }
    `;
    const variables = {
      login: github.context.actor,
    };
    const user = await client.graphql(query, variables);
    core.info(`user = ${JSON.stringify(user, null, 2)}`);
  });
}
