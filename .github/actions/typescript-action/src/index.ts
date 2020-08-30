import * as core from '@actions/core';
import * as github from '@actions/github';

void (async () => {
  try {
    core.startGroup('Print Environment Variables');
    console.log(
      JSON.stringify(process.env, Object.keys(process.env).sort(), 2)
    );
    core.endGroup();

    core.startGroup('Print github.context');
    console.log(JSON.stringify(github.context, null, 2));
    core.endGroup();

    core.debug('debug message');
    core.info('info message');
    core.warning('warning message');
    core.error('error message');

    const githubToken = core.getInput('github-token');
    if (githubToken !== '') {
      await core.group('octokit', async () => {
        const client = github.getOctokit(githubToken);
        const repo = await client.repos.get(github.context.repo);
        console.log(JSON.stringify(repo, null, 2));
      });
    }

    core.setOutput('result', 'Output from a TypeScript Actions');
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
})();
