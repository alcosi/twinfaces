import tseslint from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import fsdImport from "eslint-plugin-fsd-import";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";

const config = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
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
      react,
    },
    rules: {
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/jsx-curly-brace-presence": "error",
      "react/function-component-definition": [
        "warn",
        { namedComponents: "function-declaration" },
      ],
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
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
  {
    name: "Perfectionist Rules",
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-exports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  },
];

export default config;
