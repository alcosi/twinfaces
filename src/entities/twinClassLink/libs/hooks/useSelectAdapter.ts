import { SelectAdapter } from "@/shared/libs";
import { TWIN_CLASS_LINK_STRENGTH, TWIN_CLASS_LINK_TYPES } from "../constants";
import { LinkStrength, LinkTypes } from "../types";

export function useTwinClassLinkTypeSelectAdapter(): SelectAdapter<{
  id: LinkTypes;
  label: string;
}> {
  async function getById(id: string) {
    return TWIN_CLASS_LINK_TYPES.find((i) => i.id === id);
  }

  async function getItems() {
    return TWIN_CLASS_LINK_TYPES;
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

export function useTwinClassLinkStrengthSelectAdapter(): SelectAdapter<{
  id: LinkStrength;
  label: string;
}> {
  async function getById(id: string) {
    return TWIN_CLASS_LINK_STRENGTH.find((i) => i.id === id);
  }

  async function getItems() {
    return TWIN_CLASS_LINK_STRENGTH;
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
