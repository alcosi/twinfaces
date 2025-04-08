import { SelectAdapter } from "@/shared/libs";

import { DomainPublicView, fetchDomains } from "../..";

export function useDomainSelectAdapter(): SelectAdapter<DomainPublicView> {
  async function getById(id: string) {
    return { id };
  }

  async function getItems(
    search: string,
    filters?: unknown
  ): Promise<DomainPublicView[]> {
    const response = await fetchDomains();

    return response.domains ?? [];
  }

  function renderItem({ key, id }: DomainPublicView) {
    return key ? key : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
