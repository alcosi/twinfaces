"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  Recipient_DETAILED,
  useRecipientFetchByIdV1,
} from "@/entities/recipient";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type RecipientContextType = {
  recipientId: string;
  recipient: Recipient_DETAILED;
  refresh: () => Promise<void>;
};

export const RecipientContext = createContext<RecipientContextType>(
  {} as RecipientContextType
);

export function RecipientContextProvider({
  recipientId,
  children,
}: {
  recipientId: string;
  children: ReactNode;
}) {
  const { fetchRecipientById, loading } = useRecipientFetchByIdV1();
  const [recipient, setRecipient] = useState<Recipient_DETAILED | undefined>(
    undefined
  );

  useEffect(() => {
    refresh();
  }, [recipientId]);

  async function refresh() {
    try {
      const response = await fetchRecipientById(recipientId);

      if (response) {
        setRecipient(response);
      }
    } catch (e) {
      console.error("Failed to fetch recipient:", e);
    }
  }

  if (isUndefined(recipient) || loading) return <LoadingOverlay />;

  return (
    <RecipientContext.Provider value={{ recipientId, recipient, refresh }}>
      {children}
    </RecipientContext.Provider>
  );
}
