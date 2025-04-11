import { fetchTW004Face, getAuthHeaders } from "@/entities/face";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin } from "@/entities/twin/server";
import { TwinFieldEditor } from "@/features/twin/ui";
import { TwinsAPI } from "@/shared/api";
import { isTruthy, safe } from "@/shared/libs";

import { AlertError } from "../../components";
import { TWidgetFaceProps } from "../types";

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

async function loadTwinFieldInfo(
  twinId: string,
  fieldId: string
): Promise<{
  key: string;
  value: string;
  descriptor: TwinClassField["descriptor"];
}> {
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
        showTwinClass2TwinClassFieldMode: "DETAILED",
      },
    },
  });

  if (error || !data?.twin) {
    throw new Error("Failed to load twin data.");
  }

  if (isTruthy(STATIC_FIELD_MAP[fieldId])) {
    const ownKey = STATIC_FIELD_MAP[fieldId] as keyof Twin;
    const value = (data.twin[ownKey] as string) ?? "";

    return { key: ownKey, value, descriptor: undefined };
  }

  const twinClassField = data.relatedObjects?.twinClassFieldMap?.[fieldId];
  const inheritedKey = data.relatedObjects?.twinClassFieldMap?.[fieldId]?.key;
  const value = data.twin.fields?.[inheritedKey!] ?? "";

  if (!inheritedKey) {
    throw new Error("Failed to retrieve dynamic field key or value.");
  }

  return { key: inheritedKey, value, descriptor: twinClassField?.descriptor };
}

export async function TW004(props: TWidgetFaceProps) {
  const { twinId, widget } = props;

  const twidgetResult = await safe(() =>
    fetchTW004Face(widget.widgetFaceId, twinId)
  );
  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW004 failed to load." />;
  }
  const twidget = twidgetResult.data;

  const { key, value, descriptor } = await loadTwinFieldInfo(
    twidget.pointedTwinId!,
    twidget.twinClassFieldId!
  );

  return (
    <TwinFieldEditor
      id={twidget.id!}
      twinId={twidget.pointedTwinId!}
      label={
        twidget.label || (
          <label className="px-3 text-sm font-bold italic text-muted">
            Unknown
          </label>
        )
      }
      field={{ key, value, descriptor }}
    />
  );
}
