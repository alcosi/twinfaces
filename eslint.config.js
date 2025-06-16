import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import fsdImport from "eslint-plugin-fsd-import";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

const config = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "src/lib/api/generated/schema.d.ts",
    ],

    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      prettier: prettier,
      "fsd-import": fsdImport,
      "@next/next": nextPlugin,
    },

    rules: {
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "fsd-import/layer-imports": ["error", { alias: "@" }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "warn",
      ...nextPlugin.configs.recommended.rules,
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];

export default config;
