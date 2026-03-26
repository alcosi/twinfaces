"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  OPTION_PROJECTION_SHEMA,
  OptionProjection_DETAILED,
  TitleOptionProjections,
  useOptionProjectionCreate,
  useOptionProjectionFilters,
  useOptionProjectionSearch,
} from "@/entities/option-projection";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import {
  formatIntlDate,
  isFalsy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

import { OptionsProjectionFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    OptionProjection_DETAILED,
    | "id"
    | "projectionType"
    | "dstDataListOption"
    | "dstDataList"
    | "srcDataListOption"
    | "srcDataList"
    | "savedByUser"
    | "changedAt"
  >,
  ColumnDef<OptionProjection_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  projectionType: {
    id: "projectionType",
    accessorKey: "projectionType",
    header: "Type",
    cell: ({ row: { original } }) =>
      original.projectionType && (
        <div className="inline-flex max-w-48">
          <ProjectionTypeResourceLink
            data={original.projectionType}
            withTooltip
          />
        </div>
      ),
  },

  dstDataListOption: {
    id: "dstDataListOption",
    accessorKey: "dstDataListOption",
    header: "Dst option",
    cell: ({ row: { original } }) =>
      original.dstDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.dstDataListOption}
            withTooltip
          />
        </div>
      ),
  },

  dstDataList: {
    id: "dstDataList",
    accessorKey: "dstDataList",
    header: "Dsc data list",
    cell: ({ row: { original } }) =>
      original.dstDataList && (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.dstDataList} withTooltip />
        </div>
      ),
  },

  srcDataListOption: {
    id: "srcDataListOption",
    accessorKey: "srcDataListOption",
    header: "Src option",
    cell: ({ row: { original } }) =>
      original.srcDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.srcDataListOption}
            withTooltip
          />
        </div>
      ),
  },

  srcDataList: {
    id: "srcDataList",
    accessorKey: "srcDataList",
    header: "Src data list",
    cell: ({ row: { original } }) =>
      original.srcDataList && (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.srcDataList} withTooltip />
        </div>
      ),
  },

  savedByUser: {
    id: "savedByUser",
    accessorKey: "savedByUser",
    header: "Saved by user",
    cell: ({ row: { original } }) =>
      original.savedByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.savedByUser} withTooltip />
        </div>
      ),
  },

  changedAt: {
    id: "changedAt",
    accessorKey: "changedAt",
    header: "Changed at",
    cell: ({ row: { original } }) =>
      original.changedAt &&
      original.changedAt &&
      formatIntlDate(original.changedAt, "datetime-local"),
  },
};
export function OptionProjectionsScreen({
  title,
  optionId,
}: {
  title?: TitleOptionProjections;
  optionId?: string;
}) {
  const { searchOptionProjection } = useOptionProjectionSearch();
  const { createOptionProjection } = useOptionProjectionCreate();
  const { buildFilterFields, mapFiltersToPayload } = useOptionProjectionFilters(
    {
      enabledFilters:
        title === "Incoming"
          ? [
              "idList",
              "projectionTypeIdList",
              "srcDataListOptionIdList",
              "savedByUserIdList",
              "changedAtFrom",
              "changedAtTo",
            ]
          : title === "Outgoing"
            ? [
                "idList",
                "projectionTypeIdList",
                "dstDataListOptionIdList",
                "savedByUserIdList",
                "changedAtFrom",
                "changedAtTo",
              ]
            : undefined,
    }
  );

  const optionProjectionForm = useForm<z.infer<typeof OPTION_PROJECTION_SHEMA>>(
    {
      resolver: zodResolver(OPTION_PROJECTION_SHEMA),
      defaultValues: {
        projectionTypeId: "",
        srcDataListOptionId: optionId && title === "Outgoing" ? optionId : "",
        dstDataListOptionId: optionId && title === "Incoming" ? optionId : "",
      },
    }
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof OPTION_PROJECTION_SHEMA>
  ) => {
    await createOptionProjection({
      body: {
        dataListOptionProjectionList: [
          {
            ...formValues,
          },
        ],
      },
    });
    toast.success("Option projection created successfully!");
  };

  async function fetchOptionsProjection(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<OptionProjection_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      return await searchOptionProjection({
        pagination,
        filters: {
          ..._filters,
          dstDataListOptionIdList:
            optionId && title === "Incoming"
              ? toArrayOfString(toArray(optionId), "id")
              : _filters.dstDataListOptionIdList,
          srcDataListOptionIdList:
            optionId && title === "Outgoing"
              ? toArrayOfString(toArray(optionId), "id")
              : _filters.srcDataListOptionIdList,
        },
      });
    } catch (error) {
      toast.error(
        "An error occurred while fetching option projections: " + error
      );
      throw error;
    }
  }
  return (
    <CrudDataTable
      title={title ? title : "Option projections"}
      className="mx-auto mb-10 flex-col p-8 lg:flex lg:justify-center"
      columns={[
        colDefs.id,
        colDefs.projectionType,
        ...(isFalsy(optionId && title !== "Incoming")
          ? [colDefs.srcDataList]
          : []),
        ...(isFalsy(optionId && title !== "Incoming")
          ? [colDefs.srcDataListOption]
          : []),
        ...(isFalsy(optionId && title !== "Outgoing")
          ? [colDefs.dstDataList]
          : []),
        ...(isFalsy(optionId && title !== "Outgoing")
          ? [colDefs.dstDataListOption]
          : []),
        colDefs.savedByUser,
        colDefs.changedAt,
      ]}
      fetcher={fetchOptionsProjection}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.projectionType,
        ...(isFalsy(optionId && title !== "Incoming")
          ? [colDefs.srcDataList]
          : []),
        ...(isFalsy(optionId && title !== "Incoming")
          ? [colDefs.srcDataListOption]
          : []),
        ...(isFalsy(optionId && title !== "Outgoing")
          ? [colDefs.dstDataList]
          : []),
        ...(isFalsy(optionId && title !== "Outgoing")
          ? [colDefs.dstDataListOption]
          : []),
        colDefs.savedByUser,
        colDefs.changedAt,
      ]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      dialogForm={optionProjectionForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <OptionsProjectionFormFields
          control={optionProjectionForm.control}
          title={title}
        />
      )}
    />
  );
}
