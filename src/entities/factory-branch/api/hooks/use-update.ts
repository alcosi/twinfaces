import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryBranchUpdateRq } from "../types";

export function useUpdateFactoryBranch() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryBranch({
    factoryBranchId,
    body,
  }: {
    factoryBranchId: string;
    body: FactoryBranchUpdateRq;
  }) {
    const { error } = await api.factoryBranch.update({
      id: factoryBranchId,
      body,
    });

    if (error) {
      throw new Error("Failed to fetch factory branch due to API error", error);
    }
  }

  return { updateFactoryBranch };
}
