import { SelectAdapter } from "@/shared/libs";

import { TRANSITION_TYPES_ENUM } from "../constants";
import { TransitionType } from "../types";

export function useTransitionSelectTypeAdapter(): SelectAdapter<{
  id: TransitionType;
  label: string;
}> {
  async function getById(id: string) {
    return TRANSITION_TYPES_ENUM.find((i) => i.id === id);
  }

  async function getItems() {
    return TRANSITION_TYPES_ENUM;
  }

  function renderItem({ label }: { label: string }) {
    return label;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
