import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  TwinClassFieldV2_DETAILED,
  useFetchTwinClassFieldById,
} from "@/entities/twin-class-field";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TwinFieldContextProps = {
  twinFieldId: string;
  twinField: TwinClassFieldV2_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinFieldContext = createContext<TwinFieldContextProps>(
  {} as TwinFieldContextProps
);

export function TwinFieldContextProvider({
  twinFieldId,
  children,
}: {
  twinFieldId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [twinFieldId]);

  const [twinField, setTwinField] = useState<
    TwinClassFieldV2_DETAILED | undefined
  >(undefined);
  const { fetchTwinClassFieldById, loading } = useFetchTwinClassFieldById();

  async function refresh() {
    try {
      const response = await fetchTwinClassFieldById(twinFieldId);

      if (response) {
        setTwinField(response);
      }
    } catch {
      toast.error("Failed to fetch twin field:");
    }
  }

  if (isUndefined(twinField) || loading) return <LoadingOverlay />;

  return (
    <TwinFieldContext.Provider value={{ twinFieldId, twinField, refresh }}>
      {children}
    </TwinFieldContext.Provider>
  );
}
