import {
  LINK_STRENGTH_ENUM,
  LINK_TYPES_ENUM,
  LinkStrength,
  LinkType,
  Link_MANAGED,
  useLinkFetchById,
  useLinkSearch,
} from "@/entities/link";
import { SelectAdapter } from "@/shared/libs";

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
  const { fetchLinkById } = useLinkFetchById();

  async function getById(id: string) {
    return fetchLinkById({
      linkId: id,
      query: {
        showLinkMode: "MANAGED",
      },
    });
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
