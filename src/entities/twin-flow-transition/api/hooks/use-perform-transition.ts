import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTransitionPerformRq } from "../types";

export function usePerformTransition() {
  const api = useContext(PrivateApiContext);

  async function performTransition({
    transitionId,
    body,
  }: {
    transitionId: string;
    body: TwinTransitionPerformRq;
  }) {
    const { error } = await api.twinFlowTransition.performTransition({
      id: transitionId,
      body,
    });

    if (error) {
      throw new Error(
        "Failed to select perform transition due to API error",
        error
      );
    }
  }

  return { performTransition };
}
