import { SelectAdapter } from "@/shared/libs";
import { TwinClassLink_MANAGED, useLinkSearchV1 } from "../../api";
import { TWIN_CLASS_LINK_STRENGTH, TWIN_CLASS_LINK_TYPES } from "../constants";
import { LinkStrength, LinkType } from "../types";

export function useTwinClassLinkTypeSelectAdapter(): SelectAdapter<{
  id: LinkType;
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

export function useLinkSelectAdapter(): SelectAdapter<TwinClassLink_MANAGED> {
  const { searchLinks } = useLinkSearchV1();

  async function getById(id: string) {
    return { id } as TwinClassLink_MANAGED;
  }

  async function getItems(search: string) {
    const response = await searchLinks({ search });
    return response.data;
  }

  function renderItem({
    srcTwinClass,
    dstTwinClass,
    name,
  }: TwinClassLink_MANAGED) {
    return `${srcTwinClass.name} -> ${dstTwinClass.name} : ${name}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
