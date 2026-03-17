import { useCallback, useContext } from "react";

import { SpaceRoleCreateRq } from "@/entities/space-role";
import { PrivateApiContext } from "@/shared/api";

export const useSpaceRoleCreate = () => {
  const api = useContext(PrivateApiContext);
  const createSpaceRole = useCallback(
    async ({ body }: { body: SpaceRoleCreateRq }) => {
      try {
        const { error } = await api.spaceRole.create({ body });

        if (error) {
          throw new Error("Failed to create space role");
        }
      } catch (error) {
        throw new Error("An error occured while creating space role");
      }
    },
    [api]
  );

  return { createSpaceRole };
};
