"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` only when running on the client after hydration.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
