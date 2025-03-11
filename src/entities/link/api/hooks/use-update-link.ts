import { useCallback, useContext } from "react";

import { UpdateLinkRequestBody } from "@/entities/link";
import { PrivateApiContext } from "@/shared/api";

// TODO: Apply caching-strategy
export const useLinkUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateLink = useCallback(
    async ({
      linkId,
      body,
    }: {
      linkId: string;
      body: UpdateLinkRequestBody;
    }) => {
      return await api.link.update({ linkId, body });
    },
    [api]
  );

  return { updateLink };
};
