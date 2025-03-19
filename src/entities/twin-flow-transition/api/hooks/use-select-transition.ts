import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTransitionPerformRq } from "../types";

export function useSelectTransition() {
  const api = useContext(PrivateApiContext);

  async function selectTransition({
    transitionId,
    body,
  }: {
    transitionId: string;
    body: TwinTransitionPerformRq;
  }) {
    const { error } = await api.twinFlowTransition.selectTransition({
      id: transitionId,
      body,
    });

    if (error) {
      throw new Error("Failed to select transition due to API error", error);
    }
  }

  return { selectTransition };
}
