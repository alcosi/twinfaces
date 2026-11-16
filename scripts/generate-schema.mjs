// Generates TypeScript types from the backend OpenAPI schema using openapi-typescript.
// Cross-platform replacement for generate-schema.sh: no bash/dotenv-cli/sh required.
// Usage: npm run generate:schema
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENV_NAME = "NEXT_PUBLIC_TWINS_API_URL";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readEnvFileValue(name, file) {
  const filePath = path.join(ROOT, file);
  if (!existsSync(filePath)) return undefined;

  const nameRe = new RegExp(`^\\s*${name}\\s*=`);
  const line = readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .find((l) => !l.trimStart().startsWith("#") && nameRe.test(l));

  if (!line) return undefined;

  const value = line.slice(line.indexOf("=") + 1).trim();
  return value ? value.replace(/^["']|["']$/g, "") : undefined;
}

// Next.js precedence: process.env, then .env.local, then .env
const apiUrl =
  process.env[ENV_NAME] || readEnvFileValue(ENV_NAME, ".env.local") || readEnvFileValue(ENV_NAME, ".env");

if (!apiUrl) {
  console.error(`Error: ${ENV_NAME} is not set in .env/.env.local or environment.`);
  process.exit(1);
}

const specUrl = `${apiUrl.replace(/\/+$/, "")}/api-docs/twins-api`;
const output = path.join(ROOT, "src", "shared", "api", "generated", "schema.d.ts");
const cli = path.join(ROOT, "node_modules", "openapi-typescript", "bin", "cli.js");

if (!existsSync(cli)) {
  console.error("Error: openapi-typescript is not installed. Run `npm install` first.");
  process.exit(1);
}

console.log(`Using API URL: ${specUrl}`);
execFileSync(process.execPath, [cli, specUrl, "-o", output], { stdio: "inherit" });
