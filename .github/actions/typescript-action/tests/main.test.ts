import { afterAll, afterEach, expect, jest, test } from "@jest/globals";
import { printEnvvars } from "typescript-action/src/lib.js";

const write = jest.spyOn(process.stdout, "write").mockReturnValue(true);
const originalEnv = { ...process.env };

afterEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("printEnvvars", () => {
  process.env["PATH"] = "/usr/local/bin:/usr/bin:/bin";
  process.env["GITHUB_URL"] = "https://github.com/";

  printEnvvars();

  expect(write).toHaveBeenCalledWith("PATH=/usr/local/bin\n    :/usr/bin\n    :/bin\n");
  expect(write).toHaveBeenCalledWith("GITHUB_URL=https://github.com/\n");
});
