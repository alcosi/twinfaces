import { useCallback, useContext } from "react";

import { DataList } from "@/entities/datalist";
import { Featurer } from "@/entities/featurer";
import { Permission } from "@/entities/permission";
import { PrivateApiContext } from "@/shared/api";

import {
  TwinClassBaseV1,
  TwinClassCountGroupField,
  TwinClassCountV1,
  TwinClassFilters,
  TwinClassFreeze,
} from "../types";

/** A single server-aggregated group, hydrated with its related entity. */
export type TwinClassCountGroup = TwinClassCountV1 & {
  count: number;
  headTwinClass?: TwinClassBaseV1;
  extendsTwinClass?: TwinClassBaseV1;
  twinClassFreeze?: TwinClassFreeze;
  markerDataList?: DataList;
  tagDataList?: DataList;
  headHunterFeaturer?: Featurer;
  viewPermission?: Permission;
  editPermission?: Permission;
  deletePermission?: Permission;
};

export function useTwinClassCount() {
  const api = useContext(PrivateApiContext);

  const countTwinClass = useCallback(
    async ({
      filters = {},
      groupField,
    }: {
      filters?: TwinClassFilters;
      groupField: TwinClassCountGroupField;
    }): Promise<TwinClassCountGroup[]> => {
      try {
        const { data, error } = await api.twinClass.count({
          filters,
          groupFields: [groupField],
        });

        if (error) {
          throw new Error("Failed to count twin classes due to API error");
        }

        const related = data.relatedObjects;
        const counts = data.counts ?? [];
        const twinClassMap = related?.twinClassMap;
        const twinClassFreezeMap = related?.twinClassFreezeMap;
        const permissionMap = related?.permissionMap;
        const dataListsMap = related?.dataListsMap;
        const featurerMap = related?.featurerMap;

        return counts.map((group) => ({
          ...group,
          count: group.count ?? 0,
          headTwinClass:
            group.headTwinClassId && twinClassMap
              ? (twinClassMap[group.headTwinClassId] as TwinClassBaseV1)
              : undefined,
          extendsTwinClass:
            group.extendsTwinClassId && twinClassMap
              ? (twinClassMap[group.extendsTwinClassId] as TwinClassBaseV1)
              : undefined,
          twinClassFreeze:
            group.twinClassFreezeId && twinClassFreezeMap
              ? (twinClassFreezeMap[group.twinClassFreezeId] as TwinClassFreeze)
              : undefined,
          markerDataList:
            group.markerDataListId && dataListsMap
              ? (dataListsMap[group.markerDataListId] as DataList)
              : undefined,
          tagDataList:
            group.tagDataListId && dataListsMap
              ? (dataListsMap[group.tagDataListId] as DataList)
              : undefined,
          headHunterFeaturer:
            group.headHunterFeaturerId != null && featurerMap
              ? (featurerMap[String(group.headHunterFeaturerId)] as Featurer)
              : undefined,
          viewPermission:
            group.viewPermissionId && permissionMap
              ? (permissionMap[group.viewPermissionId] as Permission)
              : undefined,
          editPermission:
            group.editPermissionId && permissionMap
              ? (permissionMap[group.editPermissionId] as Permission)
              : undefined,
          deletePermission:
            group.deletePermissionId && permissionMap
              ? (permissionMap[group.deletePermissionId] as Permission)
              : undefined,
        }));
      } catch {
        throw new Error("An error occured while counting twin classes");
      }
    },
    [api]
  );

  return { countTwinClass };
}
