import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryBranchDuplicateRq } from "../types";

export const useFactoryBranchDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryBranch = useCallback(
    async (body: FactoryBranchDuplicateRq) => {
      try {
        const { data, error } = await api.factoryBranch.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory branch");
        }

        return data;
      } catch {
        throw new Error("An error occurred while duplicating factory branch");
      }
    },
    [api]
  );

  return { duplicateFactoryBranch };
};
