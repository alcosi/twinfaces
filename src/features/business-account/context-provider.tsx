import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  DomainBusinessAccount_DETAILED,
  useFetchBusinessAccountById,
} from "@/entities/business-account";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type BusinessAccountContextProps = {
  businessAccountId: string;
  businessAccount: DomainBusinessAccount_DETAILED;
  refresh: () => Promise<void>;
};

export const BusinessAccountContext =
  createContext<BusinessAccountContextProps>({} as BusinessAccountContextProps);

export function BusinessAccountContextProvider({
  businessAccountId,
  children,
}: {
  businessAccountId: string;
  children: ReactNode;
}) {
  const [businessAccount, setBusinessAccount] = useState<
    DomainBusinessAccount_DETAILED | undefined
  >(undefined);

  const { fetchBusinessAccountById, isLoading } = useFetchBusinessAccountById();

  const refresh = useCallback(async () => {
    try {
      const result = await fetchBusinessAccountById(businessAccountId);

      if (result) setBusinessAccount(result);
    } catch (err) {
      console.error("Failed to fetch business account:", err);
    }
  }, [businessAccountId, fetchBusinessAccountById]);

  useEffect(() => {
    refresh();
  }, [businessAccountId, refresh]);

  if (isUndefined(businessAccount) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <BusinessAccountContext.Provider
      value={{ businessAccountId, businessAccount, refresh }}
    >
      {children}
    </BusinessAccountContext.Provider>
  );
}
