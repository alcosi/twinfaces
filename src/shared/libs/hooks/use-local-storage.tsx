"use client";

import { useEffect, useState } from "react";

import { readLocalStorage, writeLocalStorage } from "../utils";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorage(key, initialValue)
  );

  useEffect(() => {
    const value = readLocalStorage(key, initialValue);
    setStoredValue(value);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    setStoredValue(valueToStore);
    writeLocalStorage(key, valueToStore);
  };

  return [storedValue, setValue];
}
