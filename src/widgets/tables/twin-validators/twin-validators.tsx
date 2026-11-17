"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Featurer_DETAILED } from "@/entities/featurer";
import {
  TWIN_VALIDATOR_SCHEMA,
  TwinValidatorCountGroup,
  TwinValidatorCountGroupField,
  TwinValidatorFilterKeys,
  TwinValidatorFilters,
  TwinValidator_DETAILED,
  useTwinValidatorCount,
  useTwinValidatorCreate,
  useTwinValidatorFilters,
  useTwinValidatorSearch,
} from "@/entities/twin-validator";
import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { BooleanIndicator, GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";
import { TwinValidatorFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinValidator_DETAILED,
    | "id"
    | "twinValidatorSet"
    | "validatorFeaturer"
    | "description"
    | "invert"
    | "active"
    | "order"
  >,
  ColumnDef<TwinValidator_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinValidatorSet: {
    id: "twinValidatorSet",
    accessorKey: "twinValidatorSet",
    header: () => (
      <SortableHeader title="Validator set" sortField="twinValidatorSetName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinValidatorSet && (
        <div className="inline-flex max-w-48">
          <ValidatorSetResourceLink
            data={original.twinValidatorSet as ValidatorSet_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  validatorFeaturer: {
    id: "validatorFeaturer",
    accessorKey: "validatorFeaturer",
    header: () => (
      <SortableHeader title="Featurer" sortField="twinValidatorFeaturerName" />
    ),
    cell: ({ row: { original } }) =>
      original.validatorFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.validatorFeaturer as Featurer_DETAILED}
            params={original.validatorDetailedParams}
            withTooltip
          />
        </div>
      ),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },
  invert: {
    id: "invert",
    accessorKey: "invert",
    header: () => <SortableHeader title="Invert" sortField="invert" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },
  order: {
    id: "order",
    accessorKey: "order",
    header: () => <SortableHeader title="Order" sortField="order" />,
  },
};

export function TwinValidatorsTable({
  twinValidatorSetId,
  title,
}: {
  /** Scopes the table to one validator set, hiding its now-constant column. */
  twinValidatorSetId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchTwinValidators } = useTwinValidatorSearch();
  const { createTwinValidator } = useTwinValidatorCreate();
  const { countTwinValidators } = useTwinValidatorCount();
  const { buildFilterFields, mapFiltersToPayload } = useTwinValidatorFilters({
    enabledFilters: isTruthy(twinValidatorSetId)
      ? [
          "idList",
          "validatorFeaturerIdList",
          "descriptionLikeList",
          "invert",
          "active",
        ]
      : undefined,
  });

  const showValidatorSetColumn = isFalsy(twinValidatorSetId);

  // Maps the table filter values to the API payload and injects the contextual
  // validator-set constraint. Shared by the table fetcher and the pie-chart
  // count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (
      rawFilters: Record<TwinValidatorFilterKeys, unknown>
    ): TwinValidatorFilters => {
      const mapped = mapFiltersToPayload(rawFilters);

      return {
        ...mapped,
        twinValidatorSetIdList: twinValidatorSetId
          ? toArrayOfString(toArray(twinValidatorSetId), "id")
          : mapped.twinValidatorSetIdList,
      };
    },
    [mapFiltersToPayload, twinValidatorSetId]
  );

  async function fetchTwinValidators(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinValidator_DETAILED>> {
    try {
      return await searchTwinValidators({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<TwinValidatorFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching validators: " + error);
      throw new Error("An error occured while fetching validators: " + error);
    }
  }

  // Server-side breakdowns backed by /private/twin_validator/count/v1, bound
  // to the active filters: the pie charts, and the grouping of the table view,
  // whose groups open through the matching search filters.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        TwinValidator_DETAILED,
        TwinValidatorCountGroup,
        TwinValidatorFilters
      >({
        fields: [
          ...(showValidatorSetColumn
            ? [
                {
                  key: "twinValidatorSet",
                  label: "Validator set",
                  groupField: "twinValidatorSetId",
                  getValue: (g: TwinValidatorCountGroup) =>
                    g.twinValidatorSetId,
                  getText: (g: TwinValidatorCountGroup) =>
                    g.twinValidatorSet?.name,
                  renderLabel: (g: TwinValidatorCountGroup) =>
                    g.twinValidatorSet && (
                      <ValidatorSetResourceLink
                        data={g.twinValidatorSet as ValidatorSet_DETAILED}
                        withTooltip
                      />
                    ),
                  narrow: narrowBy.idList<TwinValidatorFilters>(
                    "twinValidatorSetIdList"
                  ),
                },
              ]
            : []),
          {
            key: "validatorFeaturer",
            label: "Featurer",
            groupField: "validatorFeaturerId",
            getValue: (g) =>
              g.validatorFeaturerId === undefined
                ? undefined
                : String(g.validatorFeaturerId),
            getText: (g) => g.validatorFeaturer?.name,
            renderLabel: (g) =>
              g.validatorFeaturer && (
                <FeaturerResourceLink
                  data={g.validatorFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.numberList<TwinValidatorFilters>(
              "validatorFeaturerIdList"
            ),
          },
          {
            key: "invert",
            label: "Invert",
            groupField: "invert",
            getValue: (g) =>
              g.invert === undefined ? undefined : String(g.invert),
            getText: (g) =>
              g.invert === undefined
                ? undefined
                : g.invert
                  ? "Inverted"
                  : "Not inverted",
            narrow: narrowBy.ternary<TwinValidatorFilters>("invert"),
          },
          {
            key: "active",
            label: "Active",
            groupField: "active",
            getValue: (g) =>
              g.active === undefined ? undefined : String(g.active),
            getText: (g) =>
              g.active === undefined
                ? undefined
                : g.active
                  ? "Active"
                  : "Inactive",
            narrow: narrowBy.ternary<TwinValidatorFilters>("active"),
          },
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<TwinValidatorFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countTwinValidators({
            filters,
            groupField: groupField as TwinValidatorCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchTwinValidators({ pagination, filters, sort }),
      }),
    [
      resolveFilters,
      countTwinValidators,
      searchTwinValidators,
      showValidatorSetColumn,
    ]
  );

  const twinValidatorForm = useForm<z.infer<typeof TWIN_VALIDATOR_SCHEMA>>({
    resolver: zodResolver(TWIN_VALIDATOR_SCHEMA),
    defaultValues: {
      twinValidatorSetId: twinValidatorSetId || "",
      description: undefined,
      invert: false,
      active: true,
      order: 0,
    },
  });

  async function handleOnCreateSubmit(
    formValues: z.infer<typeof TWIN_VALIDATOR_SCHEMA>
  ) {
    await createTwinValidator({ body: { validators: [formValues] } });
    toast.success("Validator created successfully!");
  }

  const columns = [
    colDefs.id,
    ...(showValidatorSetColumn ? [colDefs.twinValidatorSet] : []),
    colDefs.validatorFeaturer,
    colDefs.description,
    colDefs.invert,
    colDefs.active,
    colDefs.order,
  ];

  return (
    <CrudDataTable
      permissionSegment="validators"
      columns={columns}
      defaultVisibleColumns={columns}
      getRowId={(row) => row.id}
      fetcher={fetchTwinValidators}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={chartGroupings}
      grouping={grouping}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/validators/${row.id}`)
      }
      getRowHref={(row) => `/${PlatformArea.core}/validators/${row.id}`}
      dialogForm={twinValidatorForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinValidatorFormFields
          control={twinValidatorForm.control}
          twinValidatorSetId={twinValidatorSetId}
        />
      )}
      title={title}
    />
  );
}
