import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { SpaceRoleUpdateRq } from "../types";

export function useSpaceRoleUpdate() {
  const api = useContext(PrivateApiContext);

  const updateSpaceRole = useCallback(
    async ({ body }: { body: SpaceRoleUpdateRq }) => {
      const { error } = await api.spaceRole.update({ body });

      if (error) {
        throw new Error("Failed to update space role due to API error");
      }
    },
    [api]
  );

  return { updateSpaceRole };
}
