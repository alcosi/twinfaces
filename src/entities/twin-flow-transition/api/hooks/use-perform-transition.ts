import { useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTransitionPerformRq } from "../types";

export function usePerformTransition() {
  const [loading, setLoading] = useState(false);
  const api = useContext(PrivateApiContext);

  async function performTransition({
    transitionId,
    body,
  }: {
    transitionId: string;
    body: TwinTransitionPerformRq;
  }) {
    setLoading(true);
    try {
      const { error } = await api.twinFlowTransition.performTransition({
        id: transitionId,
        body,
      });

      if (error) {
        throw new Error("Failed to perform transition due to API error", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return { performTransition, loading };
}
