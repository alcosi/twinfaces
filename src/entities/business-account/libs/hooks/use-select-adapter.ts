import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  BusinessAccount,
  DomainBusinessAccountSearchRq,
  useBusinessAccountSearch,
} from "../../api";

export function useBusinessAccountSelectAdapter(): SelectAdapter<BusinessAccount> {
  const { searchBusinessAccount } = useBusinessAccountSearch();

  async function getById(id: string) {
    const { data } = await searchBusinessAccount({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        businessAccountIdList: [id],
      } as DomainBusinessAccountSearchRq,
    });
    return data?.[0]?.businessAccount;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchBusinessAccount({
      pagination,
      filters: {
        businessAccountNameLikeList: search ? [wrapWithPercent(search)] : [],
      } as DomainBusinessAccountSearchRq,
    });

    return data?.map((item) => item.businessAccount) ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: BusinessAccount) {
    return isPopulatedString(name) ? name : isPopulatedString(id) ? id : "N/A";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
