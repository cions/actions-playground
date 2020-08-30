import {
  afterAll,
  afterEach,
  beforeEach,
  expect,
  jest,
  test,
} from "@jest/globals";

import { printEnvvars, printContexts } from "src/lib.js";

const write = jest.spyOn(process.stdout, "write").mockReturnValue(true);
const env = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...env };
});

afterEach(() => {
  jest.clearAllMocks();
  process.env = env;
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("printEnvvars", () => {
  process.env["PATH"] = "/usr/local/bin:/usr/bin:/bin";
  process.env["GITHUB_URL"] = "https://github.com/";

  printEnvvars();

  expect(write).toBeCalledWith(
    "PATH=/usr/local/bin:\n     /usr/bin:\n     /bin\n",
  );
  expect(write).toBeCalledWith("GITHUB_URL=https://github.com/\n");
});

test("printContexts", () => {
  process.env["INPUT_CONTEXTS"] = "github,steps,matrix,inputs";
  process.env["GITHUB_CONTEXT"] =
    '{\n  "repository": "cions/actions-playground"\n}';
  process.env["STEPS_CONTEXT"] =
    '{\n  "step": {\n    "outputs": {\n      "output": "value"\n    },\n    "outcome": "success",\n    "conclusion": "success"\n  }\n}';
  process.env["MATRIX_CONTEXT"] = "null";
  process.env["INPUTS_CONTEXT"] = "{}";

  printContexts();

  expect(write).toBeCalledWith(
    'github = {\n  "repository": "cions/actions-playground"\n}\n',
  );
  expect(write).toBeCalledWith(
    'steps = {\n  "step": {\n    "outputs": {\n      "output": "value"\n    },\n    "outcome": "success",\n    "conclusion": "success"\n  }\n}\n',
  );
  expect(write).toBeCalledWith("matrix = null\n");
  expect(write).toBeCalledWith("inputs = {}\n");
});
