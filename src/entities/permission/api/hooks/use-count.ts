import { useCallback, useContext } from "react";

import { PermissionGroup } from "@/entities/permission-group";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { PermissionCountGroupField, PermissionFilters } from "../types";

/** A single server-aggregated permission group, hydrated with its group. */
export type PermissionCountGroup = {
  count: number;
  groupId?: string;
  group?: PermissionGroup;
};

export function usePermissionCount() {
  const api = useContext(PrivateApiContext);

  const countPermissions = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: PermissionFilters;
      groupField: PermissionCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<PermissionCountGroup>> => {
      try {
        const { data, error } = await api.permission.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count permissions due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const permissionGroupMap = data.relatedObjects?.permissionGroupMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          groupId: group.groupId,
          group:
            group.groupId && permissionGroupMap
              ? (permissionGroupMap[group.groupId] as PermissionGroup)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting permissions");
      }
    },
    [api]
  );

  return { countPermissions };
}
