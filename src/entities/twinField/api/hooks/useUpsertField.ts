import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

// TODO: Apply caching-strategy
export const useUpsertField = () => {
  const api = useContext(PrivateApiContext);

  const upsertTwinField = useCallback(
    async (args: {
      twinId: string;
      fieldKey: string;
      fieldValue: string;
    }): Promise<string> => {
      const { data, error } = await api.twin.upsertField(args);

      if (error) {
        throw new Error("Failed to update twin field due to API error");
      }

      if (isUndefined(data.field)) {
        throw new Error("Field value is undefined.");
      }

      return data.field.value;
    },
    [api]
  );

  return { upsertTwinField };
};
