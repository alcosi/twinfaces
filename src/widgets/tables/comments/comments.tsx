"use client";

import { PaginationState } from "@tanstack/table-core";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  CommentFilterKeys,
  Comment_DETAILED,
  useCommentCount,
  useCommentFilters,
  useCommentSearchV2,
} from "@/entities/comment";
import { CommentCard } from "@/features/comment/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { isFalsy, toArray, toArrayOfString } from "@/shared/libs";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableFieldOption,
  buildCountGroupingLoad,
} from "../../crud-data-table";

type Props = {
  title?: string;
  baseTwinId?: string;
};

export function CommentsTable({ title = "Comments", baseTwinId }: Props) {
  const { searchComments } = useCommentSearchV2();
  const { countComment } = useCommentCount();
  const { buildFilterFields, mapFiltersToPayload } = useCommentFilters({
    enabledFilters: baseTwinId
      ? ["idList", "createdByUserIdList", "textLikeList", "createdAt"]
      : undefined,
  });

  // Sortable fields exposed by /private/comment/search/v2. When the list is
  // scoped to a single twin, sorting by twin name carries no information.
  const sortableFields: SortableFieldOption[] = [
    { field: "createdAt", label: "Created date" },
    { field: "changedAt", label: "Changed date" },
    ...(isFalsy(baseTwinId) ? [{ field: "twinName", label: "Twin" }] : []),
    { field: "authorUserName", label: "Author" },
  ];

  async function fetchComments(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Comment_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<CommentFilterKeys, unknown>
    );

    try {
      return await searchComments({
        pagination,
        filters: {
          ..._filters,
          twinIdList: baseTwinId
            ? toArrayOfString(toArray(baseTwinId), "id")
            : _filters.twinIdList,
        },
        sort,
      });
    } catch {
      toast.error("Failed to fetch comments");
      return { data: [], pagination: {} };
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/comment/count/v1), bound to the active filters. When the list is
  // scoped to a single twin the twin grouping is excluded — grouping by a
  // constant value carries no information.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<CommentFilterKeys, unknown>
      );
      const scopedFilters = {
        ...resolved,
        twinIdList: baseTwinId
          ? toArrayOfString(toArray(baseTwinId), "id")
          : resolved.twinIdList,
      };

      return [
        ...(isFalsy(baseTwinId)
          ? [
              {
                key: "twin",
                label: "Twin",
                load: buildCountGroupingLoad(
                  ({ offset, limit }) =>
                    countComment({
                      filters: scopedFilters,
                      groupField: "twinId",
                      offset,
                      limit,
                    }),
                  (g) => g.twinId,
                  (g) => g.twin?.name,
                  (g) =>
                    g.twin && <TwinResourceLink data={g.twin} withTooltip />
                ),
              },
            ]
          : []),
        {
          key: "author",
          label: "Author",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countComment({
                filters: scopedFilters,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.author?.fullName,
            (g) => g.author && <UserResourceLink data={g.author} withTooltip />
          ),
        },
      ];
    },
    [countComment, mapFiltersToPayload, baseTwinId]
  );

  return (
    <CrudDataTable
      permissionSegment="comments"
      title={title}
      columns={[]}
      getRowId={(row) => row.id}
      fetcher={fetchComments}
      renderListItem={(row) => (
        <CommentCard
          item={row}
          twinSlot={
            isFalsy(baseTwinId) && row.twin ? (
              <TwinResourceLink data={row.twin} withTooltip />
            ) : undefined
          }
        />
      )}
      defaultLayoutMode="list"
      disableGridView
      sortableFields={sortableFields}
      chartGroupings={buildChartGroupings}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
