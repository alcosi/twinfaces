import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassFieldUpdateRq } from "../types";

export const useFieldUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateField = useCallback(
    async ({
      fieldId,
      body,
    }: {
      fieldId: string;
      body: TwinClassFieldUpdateRq;
    }) => {
      return await api.twinClassField.update({ fieldId, body });
    },
    [api]
  );

  return { updateField };
};
