import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryBranchCreateRq } from "../types";

export const useFactoryBranchCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryBranch = useCallback(
    async ({ id, body }: { id: string; body: FactoryBranchCreateRq }) => {
      try {
        const { error } = await api.factoryBranch.create({ id, body });

        if (error) {
          throw new Error("Failed to create factory branch");
        }
      } catch (error) {
        throw new Error("An error occurred while creating factory branch");
      }
    },
    [api]
  );

  return { createFactoryBranch };
};
