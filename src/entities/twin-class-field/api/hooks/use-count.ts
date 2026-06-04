import { useCallback, useContext } from "react";

import { Featurer } from "@/entities/featurer";
import { Permission } from "@/entities/permission";
import { TwinClass } from "@/entities/twin-class";
import { PrivateApiContext } from "@/shared/api";

import {
  TwinClassFieldCountGroupField,
  TwinClassFieldCountV1,
  TwinClassFieldSearchFilters,
} from "../types";

/** A single server-aggregated group, hydrated with its related entity. */
export type TwinClassFieldCountGroup = TwinClassFieldCountV1 & {
  count: number;
  twinClass?: TwinClass;
  fieldTyperFeaturer?: Featurer;
  twinSorterFeaturer?: Featurer;
  fieldInitializerFeaturer?: Featurer;
  viewPermission?: Permission;
  editPermission?: Permission;
};

export function useTwinClassFieldCount() {
  const api = useContext(PrivateApiContext);

  const countTwinClassField = useCallback(
    async ({
      filters = {},
      groupField,
    }: {
      filters?: TwinClassFieldSearchFilters;
      groupField: TwinClassFieldCountGroupField;
    }): Promise<TwinClassFieldCountGroup[]> => {
      try {
        const { data, error } = await api.twinClassField.count({
          filters,
          groupFields: [groupField],
        });

        if (error) {
          throw new Error("Failed to count twin class fields due to API error");
        }

        const related = data.relatedObjects;
        const counts = data.counts ?? [];
        const featurerMap = related?.featurerMap;

        return counts.map((group) => ({
          ...group,
          count: group.count ?? 0,
          twinClass:
            group.twinClassId && related?.twinClassMap
              ? (related.twinClassMap[group.twinClassId] as TwinClass)
              : undefined,
          fieldTyperFeaturer:
            group.fieldTyperFeaturerId != null && featurerMap
              ? (featurerMap[String(group.fieldTyperFeaturerId)] as Featurer)
              : undefined,
          twinSorterFeaturer:
            group.twinSorterFeaturerId != null && featurerMap
              ? (featurerMap[String(group.twinSorterFeaturerId)] as Featurer)
              : undefined,
          fieldInitializerFeaturer:
            group.fieldInitializerFeaturerId != null && featurerMap
              ? (featurerMap[
                  String(group.fieldInitializerFeaturerId)
                ] as Featurer)
              : undefined,
          viewPermission:
            group.viewPermissionId && related?.permissionMap
              ? (related.permissionMap[group.viewPermissionId] as Permission)
              : undefined,
          editPermission:
            group.editPermissionId && related?.permissionMap
              ? (related.permissionMap[group.editPermissionId] as Permission)
              : undefined,
        }));
      } catch {
        throw new Error("An error occured while counting twin class fields");
      }
    },
    [api]
  );

  return { countTwinClassField };
}
