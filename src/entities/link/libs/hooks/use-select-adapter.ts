import { SelectAdapter } from "@/shared/libs";
import {
  Link_MANAGED,
  LINK_STRENGTH_ENUM,
  LINK_TYPES_ENUM,
  LinkStrength,
  LinkType,
  useLinkSearch,
} from "@/entities/link";

export function useLinkTypeSelectAdapter(): SelectAdapter<{
  id: LinkType;
  label: string;
}> {
  async function getById(id: string) {
    return LINK_TYPES_ENUM.find((i) => i.id === id);
  }

  async function getItems() {
    return LINK_TYPES_ENUM;
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

export function useLinkStrengthSelectAdapter(): SelectAdapter<{
  id: LinkStrength;
  label: string;
}> {
  async function getById(id: string) {
    return LINK_STRENGTH_ENUM.find((i) => i.id === id);
  }

  async function getItems() {
    return LINK_STRENGTH_ENUM;
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

export function useLinkSelectAdapter(): SelectAdapter<Link_MANAGED> {
  const { searchLinks } = useLinkSearch();

  async function getById(id: string) {
    return { id } as Link_MANAGED;
  }

  async function getItems(search: string) {
    const response = await searchLinks({ search });
    return response.data;
  }

  function renderItem({ srcTwinClass, dstTwinClass, name }: Link_MANAGED) {
    return `${srcTwinClass?.name} -> ${dstTwinClass?.name} : ${name}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
