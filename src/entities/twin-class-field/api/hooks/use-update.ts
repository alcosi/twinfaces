import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassFieldUpdateRq } from "../types";

export const useFieldUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateField = useCallback(
    async ({ body }: { body: TwinClassFieldUpdateRq }) => {
      return await api.twinClassField.update({ body });
    },
    [api]
  );

  return { updateField };
};
