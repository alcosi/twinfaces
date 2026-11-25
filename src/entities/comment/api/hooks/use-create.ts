import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

export const useCommentCreate = () => {
  const api = useContext(PrivateApiContext);

  const createComment = useCallback(
    async ({ twinId, text }: { twinId: string; text: string }) => {
      const { data, error } = await api.comment.create({ twinId, text });

      if (error) {
        throw new Error("Failed to add comment due to API error");
      }

      return data;
    },
    [api]
  );

  return { createComment };
};
