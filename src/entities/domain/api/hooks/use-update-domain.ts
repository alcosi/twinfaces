import { useCallback, useContext } from "react";

import { DomainUpdateRq } from "@/entities/domain";
import { PrivateApiContext } from "@/shared/api";

export const useDomainUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateDomain = useCallback(
    async ({ body }: { body: DomainUpdateRq }) => {
      return await api.domain.update({ body });
    },
    [api]
  );

  return { updateDomain };
};
