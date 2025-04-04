import { fetchTW004Face, getAuthHeaders } from "@/entities/face";
import { Twin } from "@/entities/twin/server";
import { TwinsAPI } from "@/shared/api";
import { cn, isTruthy, isUndefined, safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { widgetGridClasses } from "../../../utils";
import { TWidgetFaceProps } from "../../types";
import { TW004Client } from "./tw004-client";

const STATIC_FIELD_MAP: Record<string, string> = {
  "00000000-0000-0000-0011-000000000003": "name",
  "00000000-0000-0000-0011-000000000004": "description",
  "00000000-0000-0000-0011-000000000005": "externalId",
  "00000000-0000-0000-0011-000000000006": "ownerUserId",
  "00000000-0000-0000-0011-000000000007": "assigneeUserId",
  "00000000-0000-0000-0011-000000000008": "authorUserId",
  "00000000-0000-0000-0011-000000000009": "headTwinId",
  "00000000-0000-0000-0011-000000000010": "statusId",
  "00000000-0000-0000-0011-000000000011": "createdAt",
};

async function loadFieldInfo(
  twinId: string,
  fieldId: string
): Promise<{ key: string; value: string }> {
  const header = await getAuthHeaders();
  const { data, error } = await TwinsAPI.GET("/private/twin/{twinId}/v2", {
    params: {
      header,
      path: { twinId },
      query: {
        lazyRelation: false,
        // NOTE: for static-key variant
        showTwinMode: "DETAILED",
        // NOTE: for dynamic-key variant
        showTwinFieldCollectionMode: "ALL_FIELDS",
        showTwin2TwinClassMode: "SHORT",
        showTwinClass2TwinClassFieldMode: "SHORT",
      },
    },
  });

  if (error || !data?.twin) {
    throw new Error("Failed to load twin data.");
  }

  if (isTruthy(STATIC_FIELD_MAP[fieldId])) {
    const staticKey = STATIC_FIELD_MAP[fieldId] as keyof Twin;
    const staticValue = data.twin[staticKey] as string;

    if (isUndefined(staticValue)) {
      throw new Error(`Static value for fieldId ${fieldId} is undefined.`);
    }

    return { key: staticKey, value: staticValue };
  }

  const dynamicKey = data.relatedObjects?.twinClassFieldMap?.[fieldId]?.key;
  const dynamicValue = data.twin.fields?.[dynamicKey!];

  if (!dynamicKey || dynamicValue === undefined) {
    throw new Error("Failed to retrieve dynamic field key or value.");
  }

  return { key: dynamicKey, value: dynamicValue };
}

// TODO: Refactor — component is currently unstructured and needs cleanup.
export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const twidgetResult = await safe(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW001 failed to load." />;
  }
  const twidget = twidgetResult.data;

  const { key, value } = await loadFieldInfo(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  return (
    <TW004Client
      id={twidget.id!}
      twinId={twidget.pointedTwinId!}
      label={twidget.label}
      fieldKey={key}
      fieldValue={value}
    />
  );
}
