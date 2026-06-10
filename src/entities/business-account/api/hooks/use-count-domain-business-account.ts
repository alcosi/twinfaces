import { useCallback, useContext } from "react";

import { NotificationSchema } from "@/entities/notification";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { TwinFlowSchema } from "@/entities/twinFlowSchema";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  DomainBusinessAccountCountGroupField,
  DomainBusinessAccountFilters,
} from "../types";

/** A single server-aggregated group, hydrated with its related entity. */
export type DomainBusinessAccountCountGroup = {
  count: number;
  permissionSchemaId?: string;
  twinClassSchemaId?: string;
  twinflowSchemaId?: string;
  notificationSchemaId?: string;
  tierId?: string;
  permissionSchema?: PermissionSchema;
  twinClassSchema?: TwinClassSchema;
  twinflowSchema?: TwinFlowSchema;
  notificationSchema?: NotificationSchema;
  tier?: Tier;
};

/**
 * The raw grouped-count rows the endpoint returns at runtime. The generated
 * OpenAPI types model `/private/domain/business_account/count/v1` with the
 * search response DTO (a backend annotation shortcut — there is no dedicated
 * count response schema), so we describe the actual `counts` payload here. It
 * mirrors the sibling `business_account_user/count/v1` endpoint.
 */
type RawCount = {
  count?: number;
  permissionSchemaId?: string;
  twinClassSchemaId?: string;
  twinflowSchemaId?: string;
  notificationSchemaId?: string;
  tierId?: string;
};

export function useBusinessAccountCount() {
  const api = useContext(PrivateApiContext);

  const countBusinessAccount = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: DomainBusinessAccountFilters;
      groupField: DomainBusinessAccountCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<DomainBusinessAccountCountGroup>> => {
      try {
        const { data, error } =
          await api.businessAccount.countDomainBusinessAccount({
            filters,
            groupFields: [groupField],
            offset,
            limit,
            sortAsc,
          });

        if (error) {
          throw new Error("Failed to count business accounts due to API error");
        }

        const related = data.relatedObjects;
        const counts =
          (data as unknown as { counts?: RawCount[] }).counts ?? [];

        const items = counts.map((group) => ({
          count: group.count ?? 0,
          permissionSchemaId: group.permissionSchemaId,
          twinClassSchemaId: group.twinClassSchemaId,
          twinflowSchemaId: group.twinflowSchemaId,
          notificationSchemaId: group.notificationSchemaId,
          tierId: group.tierId,
          permissionSchema:
            group.permissionSchemaId && related?.permissionSchemaMap
              ? (related.permissionSchemaMap[
                  group.permissionSchemaId
                ] as PermissionSchema)
              : undefined,
          twinClassSchema:
            group.twinClassSchemaId && related?.twinClassSchemaMap
              ? (related.twinClassSchemaMap[
                  group.twinClassSchemaId
                ] as TwinClassSchema)
              : undefined,
          twinflowSchema:
            group.twinflowSchemaId && related?.twinflowSchemaMap
              ? (related.twinflowSchemaMap[
                  group.twinflowSchemaId
                ] as TwinFlowSchema)
              : undefined,
          notificationSchema:
            group.notificationSchemaId && related?.notificationSchemaMap
              ? (related.notificationSchemaMap[
                  group.notificationSchemaId
                ] as NotificationSchema)
              : undefined,
          tier:
            group.tierId && related?.tierMap
              ? (related.tierMap[group.tierId] as Tier)
              : undefined,
        }));

        return {
          items,
          total:
            (data as { pagination?: { total?: number } }).pagination?.total ??
            items.length,
        };
      } catch {
        throw new Error("An error occured while counting business accounts");
      }
    },
    [api]
  );

  return { countBusinessAccount };
}
