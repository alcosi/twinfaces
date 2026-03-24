import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Tier_DETAILED, useFetchTierById } from "@/entities/tier";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TierContextProps = {
  tierId: string;
  tier: Tier_DETAILED;
  refresh: () => Promise<void>;
};

export const TierContext = createContext<TierContextProps>(
  {} as TierContextProps
);

export function TierContextProvider({
  tierId,
  children,
}: {
  tierId: string;
  children: ReactNode;
}) {
  const [tier, setTier] = useState<Tier_DETAILED | undefined>(undefined);

  const { fetchTierById, isLoading } = useFetchTierById();

  const refresh = useCallback(async () => {
    try {
      const result = await fetchTierById(tierId);

      if (result) setTier(result);
    } catch (err) {
      console.error("Failed to fetch tier:", err);
    }
  }, [tierId, fetchTierById]);

  useEffect(() => {
    refresh();
  }, [tierId, refresh]);

  if (isUndefined(tier) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <TierContext.Provider value={{ tierId, tier, refresh }}>
      {children}
    </TierContext.Provider>
  );
}
