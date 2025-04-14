"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  FactoryEraser_DETAILED,
  useFactoryEraserById,
} from "@/entities/factory-eraser";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryEraserContextProps = {
  eraserId: string;
  eraser: FactoryEraser_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryEraserContext = createContext<FactoryEraserContextProps>(
  {} as FactoryEraserContextProps
);

export function FactoryEraserContextProvider({
  eraserId,
  children,
}: {
  eraserId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [eraserId]);

  const [eraser, setEraser] = useState<FactoryEraser_DETAILED | undefined>(
    undefined
  );
  const { fetchFactoryEraserById, loading } = useFactoryEraserById();

  async function refresh() {
    try {
      const response = await fetchFactoryEraserById({
        eraserId,
        query: {
          lazyRelation: false,
          showFactoryEraserMode: "DETAILED",
          showFactoryEraser2FactoryMode: "DETAILED",
          showFactoryEraser2TwinClassMode: "DETAILED",
          showFactoryEraser2FactoryConditionSetMode: "DETAILED",
        },
      });
      setEraser(response);
    } catch (error) {
      toast.error("Failed to fetch factory eraser");
    }
  }

  if (isUndefined(eraser) || loading) return <LoadingOverlay />;

  return (
    <FactoryEraserContext.Provider value={{ eraserId, eraser, refresh }}>
      {children}
    </FactoryEraserContext.Provider>
  );
}
