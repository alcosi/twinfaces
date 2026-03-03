import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DataListOption_DETAILED } from "@/entities/datalist-option";
import {
  TwinClassDynamicMarker_DETAILED,
  TwinClass_DETAILED,
  useTwinClassDynamicMarkerFilters,
  useTwinClassDynamicMarkerSearch,
} from "@/entities/twin-class";
import { ValidatorSet_DETAILED } from "@/entities/validator-set/index";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui/index";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import {
  TWIN_CLASS_DYNAMIC_MARKER_SCHEMA,
  TwinClassDynamicMarkerFieldValues,
} from "./constants";
import { TwinClassDynamicMarkerFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinClassDynamicMarker_DETAILED,
    "id" | "twinClass" | "twinValidatorSetId" | "markerDataListOption"
  >,
  ColumnDef<TwinClassDynamicMarker_DETAILED>
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
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  // twinValidatorSetId: {
  //   id: "twinValidatorSetId",
  //   accessorKey: "twinValidatorSetId",
  //   header: "Validator set",
  //   cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  // },
  twinValidatorSetId: {
    id: "twinValidatorSetId",
    accessorKey: "twinValidatorSetId",
    header: "Validator set",
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
  markerDataListOption: {
    id: "markerDataListOption",
    accessorKey: "markerDataListOption",
    header: "Marker",
    cell: ({ row: { original } }) =>
      original.markerDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.markerDataListOption as DataListOption_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
};

export function TwinClassDynamicMarkersTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const router = useRouter();
  const api = useContext(PrivateApiContext);
  const { searchTwinClassDynamicMarker } = useTwinClassDynamicMarkerSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useTwinClassDynamicMarkerFilters({
      enabledFilters: isTruthy(twinClassId)
        ? ["idList", "markerDataListOptionIdList"]
        : undefined,
    });

  async function fetchTwinClassDynamicMarkers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClassDynamicMarker_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchTwinClassDynamicMarker({
        pagination,
        filters: {
          ..._filters,
          twinClassIdMap: twinClassId
            ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
            : _filters.twinClassIdMap,
        },
      });
      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch {
      toast.error("Failed to fetch twin class dynamic markers");

      return { data: [], pagination: {} };
    }
  }

  const dynamicMarkerForm = useForm<TwinClassDynamicMarkerFieldValues>({
    resolver: zodResolver(TWIN_CLASS_DYNAMIC_MARKER_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      twinValidatorSetId: "",
      markerDataListOptionId: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: TwinClassDynamicMarkerFieldValues
  ) => {
    try {
      const { error } = await api.twinClass.createDynamicMarkers({
        body: {
          dynamicMarkers: [
            {
              twinClassId: formValues.twinClassId,
              twinValidatorSetId: formValues.twinValidatorSetId || undefined,
              markerDataListOptionId:
                formValues.markerDataListOptionId || undefined,
            },
          ],
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Dynamic marker created successfully!");
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinValidatorSetId,
        colDefs.markerDataListOption,
      ]}
      fetcher={fetchTwinClassDynamicMarkers}
      getRowId={(row) => row.id}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/dynamic-markers/${row.id}`)
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinValidatorSetId,
        colDefs.markerDataListOption,
      ]}
      dialogForm={dynamicMarkerForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinClassDynamicMarkerFormFields control={dynamicMarkerForm.control} />
      )}
    />
  );
}
