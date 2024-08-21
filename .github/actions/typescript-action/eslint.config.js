import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";

export default [
  {
    ignores: ["dist/**"],
  },
  eslint.configs.recommended,
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: "1tbs",
    indent: 2,
    quotes: "double",
    semi: true,
  }),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: Object.assign(
      {},
      ...[
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ].map((x) => x.rules),
    ),
  },
  {
    files: ["tests/**.test.ts"],
    ...jestPlugin.configs["flat/recommended"],
  },
];
