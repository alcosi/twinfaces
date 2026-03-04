import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateRecipientFromMap } from "../../libs";
import { Recipient_DETAILED } from "../types";

export const useRecipientFetchByIdV1 = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipientById = useCallback(
    async (id: string): Promise<Recipient_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.recipient.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw new Error("Failed to fetch recipient due to API error");
        }

        const recipients = data.recipients ?? [];
        if (isUndefined(recipients[0])) {
          throw new Error("Invalid response data while fetching recipient");
        }

        const recipient = hydrateRecipientFromMap(
          recipients[0],
          data.relatedObjects
        );

        return recipient;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchRecipientById, loading };
};
