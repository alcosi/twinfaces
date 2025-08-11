"use client";

import { useEffect } from "react";

import { installDevTools } from "./dev-tools";

export function DevToolsClient() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    installDevTools();
  }, []);
  return null;
}
