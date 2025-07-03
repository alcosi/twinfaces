import { isServerRuntime } from "./platform";

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (isServerRuntime()) {
    console.log(`🔥[storage] Server read key "${key}"...`);
    return fallback;
  }

  try {
    const item = window.localStorage.getItem(key);
    console.log(`🔥[storage] Client read key "${key}":`, item);
    return item !== null ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`[storage] Failed to read key "${key}":`, error);
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  try {
    console.log(`🔥[storage] Write key "${key}":`, value);
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Failed to write key "${key}":`, error);
  }
}
