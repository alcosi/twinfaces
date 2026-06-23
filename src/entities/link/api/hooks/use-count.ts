import { useCallback, useContext } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { LinkCountGroupField, LinkCountItem, LinkFilters } from "../types";

export type LinkCountGroup = {
  count: number;
  srcTwinClassId?: string;
  dstTwinClassId?: string;
  createdByUserId?: string;
  type?: "ManyToOne" | "ManyToMany" | "OneToOne";
  linkStrength?: "MANDATORY" | "OPTIONAL" | "OPTIONAL_BUT_DELETE_CASCADE";
  srcTwinClassInheritable?: boolean;
  dstTwinClassInheritable?: boolean;
  srcTwinClass?: TwinClass_DETAILED;
  dstTwinClass?: TwinClass_DETAILED;
  createdByUser?: User;
};

export function useLinkCount() {
  const api = useContext(PrivateApiContext);

  const countLinks = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: LinkFilters;
      groupField: LinkCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<LinkCountGroup>> => {
      try {
        const { data, error } = await api.link.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count links due to API error");
        }

        const related = data.relatedObjects;
        const counts =
          (data as unknown as { counts?: LinkCountItem[] }).counts ?? [];

        const items: LinkCountGroup[] = counts.map((group) => ({
          count: group.count ?? 0,
          srcTwinClassId: group.srcTwinClassId,
          dstTwinClassId: group.dstTwinClassId,
          createdByUserId: group.createdByUserId,
          type: group.type,
          linkStrength: group.linkStrength,
          srcTwinClassInheritable: group.srcTwinClassInheritable,
          dstTwinClassInheritable: group.dstTwinClassInheritable,
          srcTwinClass:
            group.srcTwinClassId && related?.twinClassMap
              ? (related.twinClassMap[
                  group.srcTwinClassId
                ] as TwinClass_DETAILED)
              : undefined,
          dstTwinClass:
            group.dstTwinClassId && related?.twinClassMap
              ? (related.twinClassMap[
                  group.dstTwinClassId
                ] as TwinClass_DETAILED)
              : undefined,
          createdByUser:
            group.createdByUserId && related?.userMap
              ? (related.userMap[group.createdByUserId] as User)
              : undefined,
        }));

        return {
          items,
          total:
            (data as { pagination?: { total?: number } }).pagination?.total ??
            items.length,
        };
      } catch {
        throw new Error("An error occurred while counting links");
      }
    },
    [api]
  );

  return { countLinks };
}
