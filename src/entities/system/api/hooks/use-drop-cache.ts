import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

export function useDropCache() {
  const api = useContext(PrivateApiContext);

  const dropCache = useCallback(async () => {
    try {
      const { data, error } = await api.system.dropCaches();

      if (error) {
        throw error;
      }

      return { data };
    } catch (error) {
      console.error("Failed to drop cache:", error);
      throw new Error("An error occured while droped cache: " + error);
    }
  }, [api]);

  return { dropCache };
}
