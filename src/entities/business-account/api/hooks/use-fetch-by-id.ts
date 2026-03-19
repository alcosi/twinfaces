import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateBusinessAccountFromMap } from "../../libs";
import { DomainBusinessAccount_DETAILED } from "../types";

export function useFetchBusinessAccountById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchBusinessAccountById = useCallback(
    async (id: string): Promise<DomainBusinessAccount_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.businessAccount.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (
          isUndefined(data.businessAccounts) ||
          isEmptyArray(data.businessAccounts)
        ) {
          throw new Error(`Business account with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateBusinessAccountFromMap(
            data.businessAccounts[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchBusinessAccountById, isLoading };
}
