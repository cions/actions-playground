import { createDefaultEsmPreset } from "ts-jest";

export default {
  ...createDefaultEsmPreset(),
  resolver: "ts-jest-resolver",
};
