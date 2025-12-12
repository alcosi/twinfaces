import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { ProjectionCreateRq } from "../types";

export const useProjectionCreate = () => {
  const api = useContext(PrivateApiContext);

  const createProjection = useCallback(
    async ({ body }: { body: ProjectionCreateRq }) => {
      try {
        const { error } = await api.projection.create({ body });

        if (error) {
          throw new Error("Failed to create projection");
        }
      } catch {
        throw new Error("An error occured while creating projection");
      }
    },
    [api]
  );

  return { createProjection };
};
