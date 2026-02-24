import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassFieldUpdateBody } from "../types";

export const useFieldUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateField = useCallback(
    async ({
      fieldId,
      body,
    }: {
      fieldId: string;
      body: TwinClassFieldUpdateBody;
    }) => {
      return await api.twinClassField.update({ fieldId, body });
    },
    [api]
  );

  return { updateField };
};
