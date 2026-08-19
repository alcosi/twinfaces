"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  VALIDATOR_SETS_SHEMA,
  ValidatorSetFilterKeys,
  ValidatorSet_DETAILED,
  useValidatorSetCount,
  useValidatorSetCreate,
  useValidatorSetFilters,
  useValidatorSetSearch,
} from "@/entities/validator-set";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import { ValidatorSetFormFields } from "./form-fields";

const colDefs: Record<
  "id" | "name" | "description" | "invert",
  ColumnDef<ValidatorSet_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
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
    cell: (data) => data.getValue() && <Check />,
  },
};

export function ValidatorSetsTable() {
  const router = useRouter();
  const { searchValidatorSets } = useValidatorSetSearch();
  const { countValidatorSets } = useValidatorSetCount();
  const { createValidatorSet } = useValidatorSetCreate();
  const { buildFilterFields, mapFiltersToPayload } = useValidatorSetFilters();

  async function fetchValidatorSets(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<ValidatorSet_DETAILED>> {
    try {
      return await searchValidatorSets({
        pagination,
        filters: mapFiltersToPayload(filters.filters),
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching validator sets: " + error);
      throw new Error(
        "An error occured while fetching validator sets: " + error
      );
    }
  }

  // Builds the pie-chart breakdown from the server-side count endpoint
  // (/private/twin_validator_set/count/v1), bound to the active filters.
  // `invert` is the only field the endpoint groups by.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<ValidatorSetFilterKeys, unknown>
      );

      return [
        {
          key: "invert",
          label: "Invert",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countValidatorSets({
                filters: resolved,
                groupField: "invert",
                offset,
                limit,
              }),
            (g) => (g.invert === undefined ? undefined : String(g.invert)),
            (g) =>
              g.invert === undefined
                ? undefined
                : g.invert
                  ? "Inverted"
                  : "Not inverted"
          ),
        },
      ];
    },
    [mapFiltersToPayload, countValidatorSets]
  );

  const validatorSetsForm = useForm<z.infer<typeof VALIDATOR_SETS_SHEMA>>({
    resolver: zodResolver(VALIDATOR_SETS_SHEMA),
    defaultValues: {
      name: "",
      description: "",
      invert: false,
    },
  });

  async function handleOnCreateSubmit(
    formValues: z.infer<typeof VALIDATOR_SETS_SHEMA>
  ) {
    const { ...body } = formValues;
    await createValidatorSet({
      body: {
        validatorSets: [{ ...body }],
      },
    });

    toast.success(`Validator set created successfully!`);
  }

  return (
    <CrudDataTable
      permissionSegment="validator-sets"
      title="Validator Sets"
      columns={[colDefs.id, colDefs.name, colDefs.description, colDefs.invert]}
      fetcher={fetchValidatorSets}
      getRowId={(row) => row.id}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/validator-sets/${row.id}`)
      }
      getRowHref={(row) => `/${PlatformArea.core}/validator-sets/${row.id}`}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.invert,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={buildChartGroupings}
      dialogForm={validatorSetsForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <ValidatorSetFormFields control={validatorSetsForm.control} />
      )}
    />
  );
}
