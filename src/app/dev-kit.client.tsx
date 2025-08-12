"use client";

import { useEffect } from "react";

import { installDevKit } from "@/shared/libs";

export function DevKitProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    installDevKit();
  }, []);

  return null;
}
