import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../../libs";
import { DomainUser } from "../types";

export const useFetchUserById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserById = useCallback(
    async (id: string): Promise<DomainUser> => {
      setLoading(true);

      try {
        const { data, error } = await api.user.getById({
          id: id,
          query: {
            lazyRelation: false,
            showDomainUser2UserMode: "DETAILED",
            showDomainUserMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error("Failed to fetch user due to API error", error);
        }

        if (isUndefined(data.user)) {
          throw new Error("Response does not have user data", error);
        }

        if (data.relatedObjects) {
          return hydrateDomainUserFromMap(data.user, data.relatedObjects);
        }

        return data.user;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchUserById, loading };
};
