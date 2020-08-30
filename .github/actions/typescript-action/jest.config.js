import * as fs from "node:fs/promises";
import { pathsToModuleNameMapper } from "ts-jest";

const tsconfig = JSON.parse(
  await fs.readFile(new URL("./tsconfig.json", import.meta.url)),
);

export default {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
