import { SelectAdapter } from "@/shared/libs";

import { LAUNCHER_TYPES_ENUM } from "../constants";
import { LauncherType } from "../types";

export function useFactoryLauncherSelectAdapter(): SelectAdapter<{
  id: LauncherType;
  label: string;
}> {
  async function getById(id: string) {
    return LAUNCHER_TYPES_ENUM.find((i) => i.id === id);
  }

  async function getItems() {
    return LAUNCHER_TYPES_ENUM;
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
