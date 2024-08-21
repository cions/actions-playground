import { afterAll, afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { printEnvvars, printContexts } from "typescript-action/src/lib.js";

const dedent = (strings: TemplateStringsArray) => {
  const string = strings[0] ?? "";
  const lines = string.slice(+string.startsWith("\n")).split("\n");
  const [indent] = /^[\t ]*/.exec(lines.at(-1) ?? "") ?? [""];
  return lines.map((line) => line.slice(indent.length)).join("\n");
};

const write = jest.spyOn(process.stdout, "write").mockReturnValue(true);
const originalEnv = { ...process.env };

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("printEnvvars", () => {
  process.env.PATH = "/usr/local/bin:/usr/bin:/bin";
  process.env.GITHUB_URL = "https://github.com/";

  printEnvvars();

  expect(write).toHaveBeenCalledWith("PATH=/usr/local/bin:\n     /usr/bin:\n     /bin\n");
  expect(write).toHaveBeenCalledWith("GITHUB_URL=https://github.com/\n");
});

test("printContexts", () => {
  process.env.INPUT_CONTEXTS = "github,steps,matrix,inputs";
  process.env.GITHUB_CONTEXT = '{"repository":"cions/actions-playground"}';
  process.env.STEPS_CONTEXT = '{"step":{"outputs":{"output":"value"},"outcome":"success","conclusion":"success"}}';
  process.env.MATRIX_CONTEXT = "null";
  process.env.INPUTS_CONTEXT = "{}";

  printContexts();

  expect(write).toHaveBeenCalledWith(dedent`
  github = {
    "repository": "cions/actions-playground"
  }
  `);
  expect(write).toHaveBeenCalledWith(dedent`
  steps = {
    "step": {
      "outputs": {
        "output": "value"
      },
      "outcome": "success",
      "conclusion": "success"
    }
  }
  `);
  expect(write).toHaveBeenCalledWith("matrix = null\n");
  expect(write).toHaveBeenCalledWith("inputs = {}\n");
});
