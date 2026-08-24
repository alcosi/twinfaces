"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  TwinValidator_DETAILED,
  useFetchTwinValidatorById,
} from "@/entities/twin-validator";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type TwinValidatorContextProps = {
  twinValidatorId: string;
  twinValidator: TwinValidator_DETAILED;
  refresh: () => Promise<void>;
};

export const TwinValidatorContext = createContext<TwinValidatorContextProps>(
  {} as TwinValidatorContextProps
);

export function TwinValidatorContextProvider({
  twinValidatorId,
  children,
}: {
  twinValidatorId: string;
  children: ReactNode;
}) {
  const [twinValidator, setTwinValidator] = useState<
    TwinValidator_DETAILED | undefined
  >(undefined);

  const { fetchTwinValidatorById, isLoading } = useFetchTwinValidatorById();

  const refresh = useCallback(async () => {
    try {
      const result = await fetchTwinValidatorById(twinValidatorId);
      if (result) setTwinValidator(result);
    } catch (error) {
      console.error("Failed to fetch validator:", error);
    }
  }, [twinValidatorId, fetchTwinValidatorById]);

  useEffect(() => {
    refresh();
  }, [twinValidatorId, refresh]);

  if (isUndefined(twinValidator) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <TwinValidatorContext.Provider
      value={{ twinValidatorId, twinValidator, refresh }}
    >
      {children}
    </TwinValidatorContext.Provider>
  );
}
