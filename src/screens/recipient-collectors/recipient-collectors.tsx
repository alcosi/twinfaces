"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  RecipientCollector_DETAILED,
  useRecipientCollectorFilters,
  useRecipientCollectorSearch,
} from "@/entities/notification";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { RecipientResourceLink } from "@/features/recipient/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  | "id"
  | "historyNotificationRecipient"
  | "recipientResolverFeaturer"
  | "exclude",
  ColumnDef<RecipientCollector_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  historyNotificationRecipient: {
    id: "historyNotificationRecipient",
    accessorKey: "historyNotificationRecipient",
    header: "Notification recipient",
    cell: ({ row: { original } }) =>
      original.historyNotificationRecipient && (
        <div className="inline-flex max-w-48">
          <RecipientResourceLink
            data={original.historyNotificationRecipient}
            withTooltip
          />
        </div>
      ),
  },
  recipientResolverFeaturer: {
    id: "recipientResolverFeaturer",
    accessorKey: "recipientResolverFeaturer",
    header: "Recipient resolver featurer",
    cell: ({ row: { original } }) =>
      original.recipientResolverFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.recipientResolverFeaturer}
            params={original.recipientResolverParams}
            withTooltip
          />
        </div>
      ),
  },
  exclude: {
    id: "exclude",
    accessorKey: "exclude",
    header: "Exclude",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function RecipientCollectorsScreen() {
  const { searchRecipientCollector } = useRecipientCollectorSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useRecipientCollectorFilters({
      enabledFilters: undefined,
    });

  async function fetchHistoryNotificationRecipientCollector(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<RecipientCollector_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      return await searchRecipientCollector({
        pagination,
        filters: {
          ..._filters,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching history notification recipient collectors: " +
          error
      );
      throw new Error(
        "An error occured while fetching history notification recipient collectors: " +
          error
      );
    }
  }

  return (
    <CrudDataTable
      title="Recipient collectors"
      columns={[
        colDefs.id,
        colDefs.historyNotificationRecipient,
        colDefs.recipientResolverFeaturer,
        colDefs.exclude,
      ]}
      fetcher={fetchHistoryNotificationRecipientCollector}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.historyNotificationRecipient,
        colDefs.recipientResolverFeaturer,
        colDefs.exclude,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
