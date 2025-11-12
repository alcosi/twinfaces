import { getAuthHeaders } from "@/entities/face";
import { apiFromRequest } from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinClassFieldFromMap } from "../../libs/helpers";

export async function fetchTwinClassFieldById(id: string) {
  const header = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data, error } = await api.GET(
    "/private/twin_class_field/{twinClassFieldId}/v1",
    {
      params: {
        header,
        path: { twinClassFieldId: id },
        query: {
          lazyRelation: false,
          showTwinClassFieldMode: "MANAGED",
          showTwinClass2PermissionMode: "DETAILED",
          showTwinClassField2TwinClassMode: "DETAILED",
          showTwinClassField2FeaturerMode: "DETAILED",
          showTwinClassField2PermissionMode: "DETAILED",
        },
      },
    }
  );

  if (error) {
    throw error;
  }

  if (isUndefined(data?.field)) {
    throw new Error("Response does not have twin-class-field data", error);
  }

  const field = hydrateTwinClassFieldFromMap(data.field, data.relatedObjects);

  return field;
}
