import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinUpdateRq } from "../../server";

export const useTwinUpdate = () => {
  const [loading, setLoading] = useState(false);
  const api = useContext(PrivateApiContext);

  const updateTwin = useCallback(
    async ({ id, body }: { id: string; body: TwinUpdateRq }) => {
      setLoading(true);
      try {
        return await api.twin.update({ id, body });
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { updateTwin, loading };
};
