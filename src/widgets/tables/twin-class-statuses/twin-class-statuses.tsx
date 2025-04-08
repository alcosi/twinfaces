import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  TwinClassStatusFormValues,
  TwinStatusCreateRq,
  TwinStatus_DETAILED,
  useStatusCreate,
  useStatusFilters,
  useTwinStatusSearchV1,
} from "@/entities/twin-status";
import { ImageWithFallback } from "@/features/ui/image-with-fallback";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, reduceToObject, toArray } from "@/shared/libs";
import { ColorTile } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinClassStatusFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinStatus_DETAILED,
    | "logo"
    | "id"
    | "key"
    | "name"
    | "twinClassId"
    | "description"
    | "backgroundColor"
    | "fontColor"
  >,
  ColumnDef<TwinStatus_DETAILED>
> = {
  logo: {
    id: "logo",
    accessorKey: "logo",
    header: "Logo",
    cell: (data) => {
      const value = data.row.original.logo;
      return (
        <ImageWithFallback
          src={value as string}
          alt={value as string}
          fallbackContent={<Unplug />}
          width={32}
          height={32}
          className="text-[0]"
        />
      );
    },
  },

  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  key: {
    id: "key",
    accessorKey: "key",
    header: "Key",
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },

  backgroundColor: {
    id: "backgroundColor",
    accessorKey: "backgroundColor",
    header: "Background Color",
    cell: (data) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <ColorTile color={data.getValue<string>()} />
          </TooltipTrigger>
          <TooltipContent>{data.getValue<string>()}</TooltipContent>
        </Tooltip>
      );
    },
  },

  fontColor: {
    id: "fontColor",
    accessorKey: "fontColor",
    header: "Font Color",
    cell: (data) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <ColorTile color={data.getValue<string>()} />
          </TooltipTrigger>
          <TooltipContent>{data.getValue<string>()}</TooltipContent>
        </Tooltip>
      );
    },
  },
};

export function TwinClassStatusesTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinStatuses } = useTwinStatusSearchV1();
  const { createStatus } = useStatusCreate();
  const { buildFilterFields, mapFiltersToPayload } = useStatusFilters({
    enabledFilters: isTruthy(twinClassId)
      ? ["idList", "keyLikeList", "nameI18nLikeList", "descriptionI18nLikeList"]
      : undefined,
  });

  const form = useForm<TwinClassStatusFormValues>({
    resolver: zodResolver(TWIN_CLASS_STATUS_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      key: "",
      name: "",
      description: "",
      logo: "",
      backgroundColor: "#000000",
      fontColor: "#000000",
    },
  });

  async function fetchStatuses(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinStatus_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwinStatuses({
        pagination,
        filters: {
          ..._filters,
          twinClassIdMap: twinClassId
            ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
            : _filters.twinClassIdMap,
        },
      });
    } catch (e) {
      toast.error("Failed to fetch statuses");
      return { data: [], pagination: {} };
    }
  }

  async function handleCreate(formValues: TwinClassStatusFormValues) {
    const data: TwinStatusCreateRq = {
      key: formValues.key,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
        translations: {},
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
        translations: {},
      },
      logo: formValues.logo,
      backgroundColor: formValues.backgroundColor,
      fontColor: formValues.fontColor,
    };

    if (!twinClassId) {
      toast.error("Twin class ID is missing");
      return;
    }

    await createStatus({
      twinClassId: twinClassId || formValues.twinClassId!,
      body: data,
    });

    toast.success("Status created successfully!");
    fetchStatuses({ pageIndex: 0, pageSize: 10 }, { filters: {} });
  }

  return (
    <CrudDataTable
      title="Statuses"
      ref={tableRef}
      columns={[
        colDefs.logo,
        colDefs.id,
        ...(isFalsy(twinClassId) ? [colDefs.twinClassId] : []),
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.backgroundColor,
        colDefs.fontColor,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchStatuses}
      onRowClick={(row) =>
        router.push(
          `/${PlatformArea.core}/twinclass/${row.twinClassId}/twinStatus/${row.id}`
        )
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.logo,
        colDefs.id,
        ...(isFalsy(twinClassId) ? [colDefs.twinClassId] : []),
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.backgroundColor,
        colDefs.fontColor,
      ]}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => (
        <TwinClassStatusFormFields control={form.control} />
      )}
    />
  );
}
