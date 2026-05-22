import { getAuthHeaders } from "@/entities/face";
import { apiFromRequest } from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinStatusFromMap } from "../../libs/helpers";

export async function fetchTwinClassStatusById(id: string) {
  const header = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data, error } = await api.GET(
    "/private/twin_status/{twinStatusId}/v1",
    {
      params: {
        header,
        path: { twinStatusId: id },
        query: {
          lazyRelation: false,
          showStatusMode: "DETAILED",
          showTwinStatus2TwinClassMode: "DETAILED",
        },
      },
    }
  );

  if (error) {
    throw error;
  }

  if (isUndefined(data.twinStatus)) {
    throw new Error("Response does not have twin-class-status data", error);
  }

  const status = hydrateTwinStatusFromMap(data.twinStatus, data.relatedObjects);

  return status;
}
