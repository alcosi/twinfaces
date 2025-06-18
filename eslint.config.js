import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import fsdImport from "eslint-plugin-fsd-import";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

const config = [
  {
    name: "Global Ignore Patterns",
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "src/lib/api/generated/schema.d.ts",
    ],
  },

  {
    name: "Base ESLint Rules",
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
    },
    rules: {
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  {
    name: "Prettier Formatting Rules",
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },

  {
    name: "Next.js Rules",
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  {
    name: "Feature-Sliced Design Rules",
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "fsd-import": fsdImport,
    },
    rules: {
      "fsd-import/layer-imports": ["error", { alias: "@" }],
    },
  },

  {
    name: "Type-Aware TypeScript Rules",
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
