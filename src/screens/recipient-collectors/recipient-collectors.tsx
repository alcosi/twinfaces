"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  HistoryNotificationRecipientCollector_DETAILED,
  useHistoryNotificationRecipientCollectorSearch,
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
  ColumnDef<HistoryNotificationRecipientCollector_DETAILED>
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
  const { searchHistoryNotificationRecipientCollector } =
    useHistoryNotificationRecipientCollectorSearch();

  async function fetchHistoryNotificationRecipientCollector(
    pagination: PaginationState,
    filters?: FiltersState
  ): Promise<PagedResponse<HistoryNotificationRecipientCollector_DETAILED>> {
    try {
      return await searchHistoryNotificationRecipientCollector({
        pagination,
        filters: {},
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
    />
  );
}
