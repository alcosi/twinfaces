import { Suspense } from "react";

import { getAuthHeaders } from "@/entities/face";
import { hydrateTwinClassFieldFromMap } from "@/entities/twin-class-field/libs/helpers";
import { LoadingScreen } from "@/screens/loading";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";
import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default async function Page({ params: { twinFieldId } }: Props) {
  const twinField = await fetchTwinClassFieldById(twinFieldId);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <TwinClassFieldScreen twinFieldId={twinFieldId} twinField={twinField} />
    </Suspense>
  );
}

async function fetchTwinClassFieldById(id: string) {
  const header = await getAuthHeaders();

  const { data, error } = await TwinsAPI.GET(
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
