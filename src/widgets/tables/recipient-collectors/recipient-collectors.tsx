"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  RECIPIENT_COLLECTOR_SCHEMA,
  RecipientCollector_DETAILED,
  useRecipientCollectorCreate,
  useRecipientCollectorFilters,
  useRecipientCollectorSearch,
} from "@/entities/notification";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { RecipientContext } from "@/features/recipient";
import { RecipientResourceLink } from "@/features/recipient/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs/index";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { RecipientCollectorFormFields } from "./form-fields";

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

export function RecipientCollectorsTable() {
  const router = useRouter();
  const { searchRecipientCollector } = useRecipientCollectorSearch();
  const { createRecipientCollector } = useRecipientCollectorCreate();
  const { recipient } = useContext(RecipientContext);
  const recipientId = recipient?.id;
  const { buildFilterFields, mapFiltersToPayload } =
    useRecipientCollectorFilters({
      enabledFilters: isTruthy(recipientId)
        ? ["idList", "recipientResolverFeaturerIdList", "exclude"]
        : undefined,
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
          recipientIdList: recipientId
            ? toArrayOfString(toArray(recipientId), "id")
            : _filters.recipientIdList,
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

  const recipientCollectorForm = useForm<
    z.infer<typeof RECIPIENT_COLLECTOR_SCHEMA>
  >({
    resolver: zodResolver(RECIPIENT_COLLECTOR_SCHEMA),
    defaultValues: {
      recipientId: recipientId || "",
      recipientResolverFeaturerId: undefined,
      exclude: false,
    },
  });

  async function handleOnCreateSubmit(
    formValues: z.infer<typeof RECIPIENT_COLLECTOR_SCHEMA>
  ) {
    const { ...body } = formValues;
    await createRecipientCollector({
      body: {
        recipientCollectors: [{ ...body }],
      },
    });

    toast.success(`Recipient collector created successfully!`);
  }

  return (
    <CrudDataTable
      title="Recipient collectors"
      columns={[
        colDefs.id,
        ...(isFalsy(recipientId) ? [colDefs.historyNotificationRecipient] : []),
        colDefs.recipientResolverFeaturer,
        colDefs.exclude,
      ]}
      fetcher={fetchHistoryNotificationRecipientCollector}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(recipientId) ? [colDefs.historyNotificationRecipient] : []),
        colDefs.recipientResolverFeaturer,
        colDefs.exclude,
      ]}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/recipient-collectors/${row.id}`)
      }
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={recipientCollectorForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <RecipientCollectorFormFields
          control={recipientCollectorForm.control}
          recipientId={recipientId}
        />
      )}
    />
  );
}
