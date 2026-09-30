import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryBranchUpdate } from "../types";

export function useUpdateFactoryBranch() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryBranch({
    factoryBranchId,
    body,
  }: {
    factoryBranchId: string;
    body: Omit<FactoryBranchUpdate, "id">;
  }) {
    const { error } = await api.factoryBranch.update({
      body: { factoryBranches: [{ id: factoryBranchId, ...body }] },
    });

    if (error) {
      throw new Error("Failed to update factory branch due to API error");
    }
  }

  return { updateFactoryBranch };
}
