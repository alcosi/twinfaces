import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { UpdateLinkRequestBody } from "../types";

// TODO: Apply caching-strategy
export const useLinkUpdate = () => {
  const api = useContext(ApiContext);

  const updateLink = useCallback(
    async ({
      linkId,
      body,
    }: {
      linkId: string;
      body: UpdateLinkRequestBody;
    }) => {
      return await api.twinClassLink.update({ linkId, body });
    },
    [api]
  );

  return { updateLink };
};
