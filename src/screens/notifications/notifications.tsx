"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  Notification_DETAILED,
  useHistoryNotificationFilters,
  useHistoryNotificationSearch,
} from "@/entities/recipient";
import { NotificationChannelEventResourceLink } from "@/features/channel-event/ui";
import { NotificationSchemaResourceLink } from "@/features/notification-schema/ui/index";
import { RecipientResourceLink } from "@/features/recipient/ui/index";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  | "id"
  | "twinClass"
  | "twinClassField"
  | "historyTypeId"
  | "notificationSchemaId"
  | "historyNotificationRecipientId"
  | "notificationChannelEventId"
  | "twinValidatorSet"
  | "twinValidatorSetInvert",
  ColumnDef<Notification_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinClass: {
    id: "twinClass",
    accessorKey: "twinClass",
    header: "Twin class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },
  twinClassField: {
    id: "twinClassField",
    accessorKey: "twinClassField",
    header: "Twin class field",
    cell: ({ row: { original } }) =>
      original.twinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.twinClassField}
            withTooltip
          />
        </div>
      ),
  },
  // TODO Replace by HistoryTypeResourceLink https://alcosi.atlassian.net/browse/TWINFACES-778
  historyTypeId: {
    id: "historyTypeId",
    accessorKey: "historyTypeId",
    header: "History type",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  notificationSchemaId: {
    id: "notificationSchemaId",
    accessorKey: "notificationSchemaId",
    header: "Notification schema",
    cell: ({ row: { original } }) =>
      original.notificationSchema && (
        <div className="inline-flex max-w-48">
          <NotificationSchemaResourceLink
            data={original.notificationSchema}
            withTooltip
          />
        </div>
      ),
  },
  historyNotificationRecipientId: {
    id: "historyNotificationRecipientId",
    accessorKey: "historyNotificationRecipientId",
    header: "History notification recipient",
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
  notificationChannelEventId: {
    id: "notificationChannelEventId",
    accessorKey: "notificationChannelEventId",
    header: "Notification channel event",
    cell: ({ row: { original } }) =>
      original.notificationChannelEvent && (
        <div className="inline-flex max-w-48">
          <NotificationChannelEventResourceLink
            data={original.notificationChannelEvent}
            withTooltip
          />
        </div>
      ),
  },
  twinValidatorSet: {
    id: "twinValidatorSet",
    accessorKey: "twinValidatorSet",
    header: "Twin validator set",
    cell: ({ row: { original } }) =>
      original.twinValidatorSet && (
        <div className="inline-flex max-w-48">
          <ValidatorSetResourceLink
            data={original.twinValidatorSet}
            withTooltip
          />
        </div>
      ),
  },
  twinValidatorSetInvert: {
    id: "twinValidatorSetInvert",
    accessorKey: "twinValidatorSetInvert",
    header: "Twin validator set invert",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function NotificationsScreen() {
  const { searchHistoryNotification } = useHistoryNotificationSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useHistoryNotificationFilters({ enabledFilters: undefined });

  async function fetchNotifications(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Notification_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchHistoryNotification({
        pagination,
        filters: {
          ..._filters,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching history notifications:" + error
      );
      throw new Error(
        "An error occured while fetching history notifications: " + error
      );
    }
  }

  return (
    <CrudDataTable
      title="Notifications"
      columns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinClassField,
        colDefs.historyTypeId,
        colDefs.notificationSchemaId,
        colDefs.historyNotificationRecipientId,
        colDefs.notificationChannelEventId,
        colDefs.twinValidatorSet,
        colDefs.twinValidatorSetInvert,
      ]}
      fetcher={fetchNotifications}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinClassField,
        colDefs.historyTypeId,
        colDefs.notificationSchemaId,
        colDefs.historyNotificationRecipientId,
        colDefs.notificationChannelEventId,
        colDefs.twinValidatorSet,
        colDefs.twinValidatorSetInvert,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
