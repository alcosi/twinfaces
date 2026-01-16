import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Featurer_DETAILED } from "@/entities/featurer";
import {
  Projection_DETAILED,
  useProjectionCreate,
  useProjectionsSearch,
} from "@/entities/projection";
import {
  PROJECTION_SCHEMA,
  useProjectionFilters,
} from "@/entities/projection/libs";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PlatformArea } from "@/shared/config";
import { isFalsy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { ProjectionFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    Projection_DETAILED,
    | "id"
    | "projectionType"
    | "srcTwinClassField"
    | "dstTwinClass"
    | "dstTwinClassField"
    | "fieldProjectorFeaturer"
  >,
  ColumnDef<Projection_DETAILED>
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
    header: "Projection type",
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
  srcTwinClassField: {
    id: "srcTwinClassField",
    accessorKey: "srcTwinClassField",
    header: "Src field",
    cell: ({ row: { original } }) =>
      original.srcTwinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.srcTwinClassField}
            withTooltip
          />
        </div>
      ),
  },
  dstTwinClass: {
    id: "dstTwinClass",
    accessorKey: "dstTwinClass",
    header: "Dst class",
    cell: ({ row: { original } }) =>
      original.dstTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.dstTwinClass} withTooltip />
        </div>
      ),
  },
  dstTwinClassField: {
    id: "dstTwinClassField",
    accessorKey: "dstTwinClassField",
    header: "Dst field",
    cell: ({ row: { original } }) =>
      original.dstTwinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.dstTwinClassField}
            withTooltip
          />
        </div>
      ),
  },
  fieldProjectorFeaturer: {
    id: "fieldProjectorFeaturer",
    accessorKey: "fieldProjectorFeaturer",
    header: "Projector",
    cell: ({ row: { original } }) =>
      original.fieldProjectorFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fieldProjectorFeaturer as Featurer_DETAILED}
            params={original.fieldProjectorParams}
            withTooltip
          />
        </div>
      ),
  },
};

export function ProjectionsTable({
  twinFieldId,
  title,
}: {
  twinFieldId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchProjections } = useProjectionsSearch();
  const { buildFilterFields, mapFiltersToPayload } = useProjectionFilters({
    enabledFilters:
      title === "Incoming"
        ? [
            "idList",
            "fieldProjectorIdList",
            "srcTwinClassFieldIdList",
            "projectionTypeIdList",
          ]
        : title === "Outgoing"
          ? [
              "idList",
              "dstTwinClassIdList",
              "fieldProjectorIdList",
              "dstTwinClassFieldIdList",
              "projectionTypeIdList",
            ]
          : undefined,
  });
  const { createProjection } = useProjectionCreate();

  const projectionForm = useForm<z.infer<typeof PROJECTION_SCHEMA>>({
    resolver: zodResolver(PROJECTION_SCHEMA),
    defaultValues: {
      srcTwinPointerId: "00000000-0000-0000-0012-000000000001",
      projectionTypeId: "",
      srcTwinClassFieldId:
        twinFieldId && title === "Incoming" ? twinFieldId : "",
      dstTwinClassId: "",
      dstTwinClassFieldId:
        twinFieldId && title === "Outgoing" ? twinFieldId : "",
    },
  });

  async function fetchProjections(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchProjections({
        pagination,
        filters: {
          ..._filters,
          srcTwinClassFieldIdList:
            twinFieldId && title === "Incoming"
              ? toArrayOfString(toArray(twinFieldId), "id")
              : _filters.srcTwinClassFieldIdList,
          dstTwinClassFieldIdList:
            twinFieldId && title === "Outgoing"
              ? toArrayOfString(toArray(twinFieldId), "id")
              : _filters.dstTwinClassFieldIdList,
        },
      });
    } catch (error) {
      toast.error("An error occured while fetching projections: " + error);
      throw new Error("An error occured while fetching projections: " + error);
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof PROJECTION_SCHEMA>
  ) => {
    const { ...body } = formValues;

    await createProjection({
      body: { projectionList: [body] },
    });

    toast.success("Projection created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.projectionType,
        ...(isFalsy(twinFieldId && title !== "Incoming")
          ? [colDefs.srcTwinClassField]
          : []),
        ...(isFalsy(twinFieldId && title !== "Outgoing")
          ? [colDefs.dstTwinClass]
          : []),
        ...(isFalsy(twinFieldId && title !== "Outgoing")
          ? [colDefs.dstTwinClassField]
          : []),
        colDefs.fieldProjectorFeaturer,
      ]}
      fetcher={fetchProjections}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/projections/${row.id}`)
      }
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.projectionType,
        ...(isFalsy(twinFieldId && title !== "Incoming")
          ? [colDefs.srcTwinClassField]
          : []),
        ...(isFalsy(twinFieldId && title !== "Outgoing")
          ? [colDefs.dstTwinClass]
          : []),
        ...(isFalsy(twinFieldId && title !== "Outgoing")
          ? [colDefs.dstTwinClassField]
          : []),
        colDefs.fieldProjectorFeaturer,
      ]}
      title={title}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={projectionForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <ProjectionFormFields control={projectionForm.control} />
      )}
    />
  );
}
