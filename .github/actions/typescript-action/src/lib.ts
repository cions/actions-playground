import * as os from "node:os";
import * as path from "node:path";
import * as core from "@actions/core";
import * as github from "@actions/github";

export function printEnvvars(): void {
  const keys = Object.keys(process.env).sort();
  for (const key of keys) {
    let value = process.env[key] as string;
    if (value.split(path.delimiter).every((x) => path.isAbsolute(x))) {
      value = value.replaceAll(
        path.delimiter,
        path.delimiter + os.EOL + " ".repeat(key.length + 1),
      );
    }
    process.stdout.write(`${key}=${value}${os.EOL}`);
  }
}

export function printContexts(): void {
  const contexts = core.getInput("contexts", { required: true }).split(",");
  for (const name of contexts) {
    const value = process.env[`${name.toUpperCase()}_CONTEXT`] ?? "null";
    process.stdout.write(`${name} = ${value}${os.EOL}`);
  }
}

export async function testAction(): Promise<void> {
  process.stdout.write(`process.version = ${process.version}${os.EOL}`);
  process.stdout.write(
    `process.argv0 = ${JSON.stringify(process.argv0)}${os.EOL}`,
  );
  process.stdout.write(
    `process.argv = ${JSON.stringify(process.argv)}${os.EOL}`,
  );
  process.stdout.write(
    `process.execPath = ${JSON.stringify(process.execPath)}${os.EOL}`,
  );
  process.stdout.write(
    `process.execArgv = ${JSON.stringify(process.execArgv)}${os.EOL}`,
  );

  process.stdout.write(
    `core.isDebug() = ${core.isDebug().toString()}${os.EOL}`,
  );
  core.debug("debug message");
  core.info("info message");
  core.notice("notice message");
  core.warning("warning message");
  core.error("error message");

  core.setOutput("output", "TypeScript Action output");
  core.exportVariable("TYPESCRIPT_ENV", "value");
  core.addPath(`${process.env.GITHUB_WORKSPACE ?? ""}/typescript`);
  core.setSecret("secrettoken");

  process.stdout.write(`STATE_PRE = ${core.getState("STATE_PRE")}${os.EOL}`);
  core.saveState("STATE_MAIN", "value");

  const idToken = await core.getIDToken();
  process.stdout.write(`core.getIDToken() = ${idToken}${os.EOL}`);

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
