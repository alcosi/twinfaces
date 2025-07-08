const fs = require("fs");
const path = require("path");

const messagesPath = path.join(__dirname, "..", "messages", "en.json");
const outputPath = path.join(__dirname, "..", "src", "i18n", "i18n.d.ts");

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      return [newKey];
    }
    if (typeof value === "object" && value !== null) {
      return flattenKeys(value, newKey);
    }
    return [];
  });
}

function generateType(keys) {
  if (!keys.length) {
    console.warn(
      "⚠️  No translation keys found. Check your en.json structure."
    );
    return null;
  }

  return `// This file is auto-generated. Do not edit manually.
export type TranslationKey =
  ${keys.map((k) => `| "${k}"`).join("\n  ")};`;
}

function main() {
  if (!fs.existsSync(messagesPath)) {
    console.error(`❌ File not found: ${messagesPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(messagesPath, "utf-8");
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.error("❌ Failed to parse en.json:", e);
    process.exit(1);
  }

  const keys = flattenKeys(json);
  const typeDef = generateType(keys);

  if (!typeDef) {
    console.error("❌ Failed to generate types. No keys found.");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, typeDef, "utf-8");

  console.log(`✅ Types generated at: ${outputPath}`);
}

main();
