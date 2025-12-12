import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { ProjectionUpdateRq } from "../types";

export function useUpdateProjection() {
  const api = useContext(PrivateApiContext);

  async function updateProjection({ body }: { body: ProjectionUpdateRq }) {
    const { error } = await api.projection.update({
      body,
    });

    if (error) {
      throw new Error("Failed to update projection due to API error", error);
    }
  }

  return { updateProjection };
}
