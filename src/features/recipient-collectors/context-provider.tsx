"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  RecipientCollector_DETAILED,
  useRecipientCollectorFetchById,
} from "@/entities/notification";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type RecipientCollectorContextType = {
  collectorId: string;
  recipientCollector: RecipientCollector_DETAILED;
  refresh: () => Promise<void>;
};

export const RecipientCollectorContext =
  createContext<RecipientCollectorContextType>(
    {} as RecipientCollectorContextType
  );

export function RecipientCollectorContextProvider({
  collectorId,
  children,
}: {
  collectorId: string;
  children: ReactNode;
}) {
  const { fetchRecipientCollectorById, loading } =
    useRecipientCollectorFetchById();
  const [recipientCollector, setRecipientCollector] = useState<
    RecipientCollector_DETAILED | undefined
  >(undefined);

  useEffect(() => {
    refresh();
  }, [collectorId]);

  async function refresh() {
    try {
      const response = await fetchRecipientCollectorById(collectorId);

      if (response) {
        setRecipientCollector(response);
      }
    } catch (e) {
      console.error("Failed to fetch recipient collector:", e);
    }
  }

  if (isUndefined(recipientCollector) || loading) return <LoadingOverlay />;

  return (
    <RecipientCollectorContext.Provider
      value={{ collectorId, recipientCollector, refresh }}
    >
      {children}
    </RecipientCollectorContext.Provider>
  );
}
