import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassDynamicMarkerUpdateRq } from "../types";

export const useUpdateTwinClassDynamicMarker = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinClassDynamicMarker = useCallback(
    async ({ body }: { body: TwinClassDynamicMarkerUpdateRq }) => {
      return await api.twinClass.updateDynamicMarkers({ body });
    },
    [api]
  );

  return { updateTwinClassDynamicMarker };
};
