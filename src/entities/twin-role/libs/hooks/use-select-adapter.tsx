import { SelectAdapter } from "@/shared/libs";

import { TWIN_ROLE_ENUM } from "../constants";
import { TwinRole } from "../types";

export function useTwinRoleSelectAdapter(): SelectAdapter<{
  id: TwinRole;
  label: string;
}> {
  async function getById(id: string) {
    return TWIN_ROLE_ENUM.find((i) => i.id === id);
  }

  async function getItems() {
    return TWIN_ROLE_ENUM;
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
