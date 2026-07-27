"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  TwinLinkCountGroup,
  TwinLinkFilterKeys,
  TwinLink_DETAILED,
  useTwinLinkCount,
  useTwinLinkFilters,
  useTwinLinkSearch,
} from "@/entities/twin-link";
import type { Twin } from "@/entities/twin/server";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { formatIntlDate, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableFieldOption,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";

/**
 * Which side of a link the table is scoped by. "forward" lists the links going
 * out of the base twin (it is the source), "backward" the ones pointing at it
 * (it is the destination).
 */
export type TwinLinkDirection = "forward" | "backward";

type TwinSide = "src" | "dst";

/** Everything that differs between the source and destination twin of a link. */
type TwinSideConfig = {
  label: string;
  columnId: string;
  filterKey: Extract<TwinLinkFilterKeys, "srcTwinIdList" | "dstTwinIdList">;
  sortField: "srcTwinName" | "dstTwinName";
  groupField: "srcTwinId" | "dstTwinId";
  getTwin: (row: TwinLink_DETAILED) => Twin | undefined;
  getGroupId: (group: TwinLinkCountGroup) => string | undefined;
  getGroupTwin: (group: TwinLinkCountGroup) => Twin | undefined;
};

const TWIN_SIDES: Record<TwinSide, TwinSideConfig> = {
  src: {
    label: "Src twin",
    columnId: "srcTwinId",
    filterKey: "srcTwinIdList",
    sortField: "srcTwinName",
    groupField: "srcTwinId",
    getTwin: (row) => row.srcTwin,
    getGroupId: (group) => group.srcTwinId,
    getGroupTwin: (group) => group.srcTwin,
  },
  dst: {
    label: "Dst twin",
    columnId: "dstTwinId",
    filterKey: "dstTwinIdList",
    sortField: "dstTwinName",
    groupField: "dstTwinId",
    getTwin: (row) => row.dstTwin,
    getGroupId: (group) => group.dstTwinId,
    getGroupTwin: (group) => group.dstTwin,
  },
};

/** The side the base twin occupies for a given direction. */
const DIRECTION_PINNED_SIDE: Record<TwinLinkDirection, TwinSide> = {
  forward: "src",
  backward: "dst",
};

function buildTwinColumn(side: TwinSideConfig): ColumnDef<TwinLink_DETAILED> {
  return {
    id: side.columnId,
    accessorKey: side.columnId,
    header: () => (
      <SortableHeader title={side.label} sortField={side.sortField} />
    ),
    cell: ({ row: { original } }) => {
      const twin = side.getTwin(original);
      return (
        twin && (
          <div className="inline-flex max-w-48">
            <TwinResourceLink data={twin} withTooltip />
          </div>
        )
      );
    },
  };
}

function buildColumns(sides: TwinSideConfig[]): ColumnDef<TwinLink_DETAILED>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
    },
    ...sides.map(buildTwinColumn),
    {
      id: "linkId",
      accessorKey: "linkId",
      header: () => <SortableHeader title="Link" sortField="linkName" />,
      cell: ({ row: { original } }) =>
        original.link && (
          <div className="inline-flex max-w-48">
            <LinkResourceLink data={original.link} withTooltip />
          </div>
        ),
    },
    {
      id: "createdByUserId",
      accessorKey: "createdByUserId",
      header: () => (
        <SortableHeader title="Created by" sortField="createdByUserName" />
      ),
      cell: ({ row: { original } }) =>
        original.createdByUser && (
          <div className="inline-flex max-w-48">
            <UserResourceLink data={original.createdByUser} withTooltip />
          </div>
        ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: () => <SortableHeader title="Created at" sortField="createdAt" />,
      cell: ({ row: { original } }) =>
        original.createdAt &&
        formatIntlDate(original.createdAt, "datetime-local"),
    },
  ];
}

type Props = {
  title?: string;
  onRowClick?: (row: TwinLink_DETAILED) => void;
  getRowHref?: (row: TwinLink_DETAILED) => string;
} & (
  | {
      /** Lists only the links on one side of this twin. */
      twinId: string;
      direction: TwinLinkDirection;
    }
  | { twinId?: undefined; direction?: undefined }
);

export function TwinLinksTable({
  twinId,
  direction,
  title = "Twin links",
  onRowClick,
  getRowHref,
}: Props) {
  const { searchTwinLinks } = useTwinLinkSearch();
  const { countTwinLinks } = useTwinLinkCount();

  // Scoped to one twin: that side of the link is a constant, so its column,
  // filter and grouping carry no information and are dropped. Unscoped, both
  // sides are shown and everything stays available.
  const pinnedSide = direction ? DIRECTION_PINNED_SIDE[direction] : undefined;
  const sides = useMemo(
    () =>
      (["src", "dst"] as const)
        .filter((side) => side !== pinnedSide)
        .map((side) => TWIN_SIDES[side]),
    [pinnedSide]
  );

  const { buildFilterFields, mapFiltersToPayload } = useTwinLinkFilters({
    enabledFilters: pinnedSide
      ? [
          "idList",
          ...sides.map((side) => side.filterKey),
          "linkIdList",
          "createdByUserIdList",
          "createdAt",
        ]
      : undefined,
  });

  const columns = buildColumns(sides);

  // The card view has no clickable column headers, so the toolbar sort
  // dropdown is what keeps it sortable. It mirrors the same sort state the
  // table view's sortable headers drive.
  const sortableFields: SortableFieldOption[] = [
    { field: "createdAt", label: "Created date" },
    ...sides.map((side) => ({ field: side.sortField, label: side.label })),
    { field: "linkName", label: "Link" },
    { field: "createdByUserName", label: "Created by" },
  ];

  // Maps the table filter values to the API payload and — when scoped — pins
  // the base twin to its side of the link. Shared by the table fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<TwinLinkFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      if (!pinnedSide || !twinId) return mapped;

      return {
        ...mapped,
        [TWIN_SIDES[pinnedSide].filterKey]: toArrayOfString(
          toArray(twinId),
          "id"
        ),
      };
    },
    [mapFiltersToPayload, pinnedSide, twinId]
  );

  async function fetchTwinLinks(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinLink_DETAILED>> {
    try {
      return await searchTwinLinks({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<TwinLinkFilterKeys, unknown>
        ),
        sort,
      });
    } catch {
      toast.error("Failed to fetch twin links");
      return { data: [], pagination: {} };
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/twin_link/search/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<TwinLinkFilterKeys, unknown>
      );

      return [
        ...sides.map((side) => ({
          key: side.groupField,
          label: side.label,
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinLinks({
                filters: resolved,
                groupField: side.groupField,
                offset,
                limit,
              }),
            side.getGroupId,
            (group) => side.getGroupTwin(group)?.name,
            (group) => {
              const twin = side.getGroupTwin(group);
              return twin && <TwinResourceLink data={twin} withTooltip />;
            }
          ),
        })),
        {
          key: "linkId",
          label: "Link",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinLinks({
                filters: resolved,
                groupField: "linkId",
                offset,
                limit,
              }),
            (g) => g.linkId,
            (g) => g.link?.name,
            (g) => g.link && <LinkResourceLink data={g.link} withTooltip />
          ),
        },
        {
          key: "createdByUserId",
          label: "Created by",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinLinks({
                filters: resolved,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.createdByUser?.fullName,
            (g) =>
              g.createdByUser && (
                <UserResourceLink data={g.createdByUser} withTooltip />
              )
          ),
        },
      ];
    },
    [resolveFilters, countTwinLinks, sides]
  );

  return (
    <CrudDataTable
      permissionSegment="twin-links"
      title={title}
      columns={columns}
      defaultVisibleColumns={columns}
      getRowId={(row) => row.id!}
      fetcher={fetchTwinLinks}
      filters={{ filtersInfo: buildFilterFields() }}
      sortableFields={sortableFields}
      chartGroupings={buildChartGroupings}
      onRowClick={onRowClick}
      getRowHref={getRowHref}
    />
  );
}
