import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: [compat.extends("eslint:recommended"), prettier],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
      ),
      prettier,
    ],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
      },
    },

    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "warn",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
  {
    files: ["**/*.js"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 2020,
      sourceType: "module",
    },

    rules: {
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
]);
