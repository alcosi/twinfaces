import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryBranch_DETAILED,
  useFetchFactoryBranchById,
} from "@/entities/factory-branch";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryBranchContextProps = {
  factoryBranchId: string;
  factoryBranch: FactoryBranch_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryBranchContext = createContext<FactoryBranchContextProps>(
  {} as FactoryBranchContextProps
);

export function FactoryBranchContextProvider({
  factoryBranchId,
  children,
}: {
  factoryBranchId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [factoryBranchId]);

  const [factoryBranch, setFactoryBranch] = useState<
    FactoryBranch_DETAILED | undefined
  >(undefined);
  const { fetchFactoryBranchById, loading } = useFetchFactoryBranchById();

  async function refresh() {
    try {
      const fetchedFactoryBranch =
        await fetchFactoryBranchById(factoryBranchId);

      if (fetchedFactoryBranch) {
        setFactoryBranch(fetchedFactoryBranch);
      }
    } catch (error) {
      console.error("Failed to fetch factory branch:", error);
    }
  }

  if (isUndefined(factoryBranch) || loading) return <LoadingOverlay />;

  return (
    <FactoryBranchContext.Provider
      value={{ factoryBranchId, factoryBranch, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </FactoryBranchContext.Provider>
  );
}
