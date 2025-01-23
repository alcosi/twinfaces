import { useDatalistSelectAdapter } from "@/entities/datalist";
import { FeaturerParamType } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { usePermissionSchemaSelectAdapter } from "@/entities/permissionSchema";
import {
  useTwinBasicFieldSelectAdapter,
  useTwinSelectAdapter,
  useTwinTouchIdSelectAdapter,
} from "@/entities/twin";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useUserGroupSelectAdapter } from "@/entities/userGroup";
import { createFixedSelectAdapter, SelectAdapter } from "@/shared/libs";
import { useMemo } from "react";

type FeaturerParamTypesSelectAdapter =
  | ReturnType<
      | typeof useUserGroupSelectAdapter
      | typeof useTwinSelectAdapter
      | typeof useTwinFlowSchemaSelectAdapter
      | typeof useDatalistSelectAdapter
      | typeof useTwinStatusSelectAdapter
      | typeof useTwinClassSelectAdapter
      | typeof useTwinClassFieldSelectAdapter
      | typeof usePermissionSelectAdapter
      | typeof usePermissionSchemaSelectAdapter
      | typeof useTwinBasicFieldSelectAdapter
      | typeof useTwinTouchIdSelectAdapter
    >
  | SelectAdapter<never>;

export function useFeaturerParamTypesSelectAdapter(
  type?: FeaturerParamType
): FeaturerParamTypesSelectAdapter {
  const statusAdapter = useTwinStatusSelectAdapter();

  const adapters = {
    [FeaturerParamType.UUID_SET_TWINS_USER_GROUP_ID]:
      useUserGroupSelectAdapter(),
    [FeaturerParamType.UUID_TWINS_TWIN_ID]: useTwinSelectAdapter(),
    [FeaturerParamType.UUID_TWINS_TWINFLOW_SCHEMA_ID]:
      useTwinFlowSchemaSelectAdapter(),
    [FeaturerParamType.UUID_TWINS_DATA_LIST_ID]: useDatalistSelectAdapter(),
    [FeaturerParamType.UUID_SET_TWINS_TWIN_STATUS_ID]: statusAdapter,
    [FeaturerParamType.UUID_TWINS_TWIN_STATUS_ID]: statusAdapter,
    [FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_ID]:
      useTwinClassSelectAdapter(),
    [FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_FIELD_ID]:
      useTwinClassFieldSelectAdapter(),
    [FeaturerParamType.UUID_TWINS_PERMISSION_ID]: usePermissionSelectAdapter(),
    [FeaturerParamType.UUID_TWINS_PERMISSION_SCHEMA_ID]:
      usePermissionSchemaSelectAdapter(),
    [FeaturerParamType.STRING_TWINS_TWIN_BASIC_FIELD]:
      useTwinBasicFieldSelectAdapter(),
    [FeaturerParamType.STRING_TWINS_TWIN_TOUCH_ID]:
      useTwinTouchIdSelectAdapter(),
  };

  const adapter = useMemo(() => {
    if (type && type in adapters) {
      return adapters[type as keyof typeof adapters];
    }

    return createFixedSelectAdapter([]);
  }, [type, adapters]);

  return adapter;
}
