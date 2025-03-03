import { isPopulatedString } from "../types";

export function generateUUID(): string {
  const uuid = crypto.randomUUID();
  return uuid;
}

export function shortenUUID(uuid: string): string {
  if (isPopulatedString(uuid) && uuid.length >= 8) {
    return `${uuid.slice(0, 8)}...${uuid.slice(-2)}`;
  }
  return uuid;
}
