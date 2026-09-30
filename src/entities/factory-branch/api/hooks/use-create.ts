import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryBranchCreate } from "../types";

export const useFactoryBranchCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryBranch = useCallback(
    async ({ body }: { body: FactoryBranchCreate }) => {
      try {
        const { data, error } = await api.factoryBranch.create({
          body: { factoryBranches: [body] },
        });

        if (error) {
          throw new Error("Failed to create factory branch");
        }

        return data?.factoryBranchList?.[0]?.id;
      } catch (error) {
        throw new Error("An error occurred while creating factory branch");
      }
    },
    [api]
  );

  return { createFactoryBranch };
};
