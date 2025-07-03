"use client";

import { useRef, useState } from "react";

import { isDeepEqual, readLocalStorage, writeLocalStorage } from "../utils";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorage(key, initialValue)
  );
  const prevValueRef = useRef<T>(storedValue);

  const setValue = (value: T | ((val: T) => T)) => {
    console.log("🔥🔥 setValue called", value);
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    if (!isDeepEqual(prevValueRef.current, valueToStore)) {
      console.log("🔥🔥 setValue changing", valueToStore);
      prevValueRef.current = valueToStore;
      setStoredValue(valueToStore);
      writeLocalStorage(key, valueToStore);
    }
  };

  return [storedValue, setValue];
}
