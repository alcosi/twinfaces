"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  CommentCountGroup,
  CommentCountGroupField,
  CommentFilterKeys,
  CommentFilters,
  Comment_DETAILED,
  useCommentCount,
  useCommentFilters,
  useCommentSearchV2,
} from "@/entities/comment";
import { CommentCard } from "@/features/comment/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import {
  formatIntlDate,
  isFalsy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  FiltersState,
  SortableFieldOption,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    Comment_DETAILED,
    "id" | "text" | "twinId" | "authorUserId" | "createdAt" | "changedAt"
  >,
  ColumnDef<Comment_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  text: {
    id: "text",
    accessorKey: "text",
    header: "Comment",
    cell: ({ row: { original } }) => (
      <div className="text-foreground/90 line-clamp-2 max-w-md break-words whitespace-pre-wrap">
        {original.text}
      </div>
    ),
  },

  twinId: {
    id: "twinId",
    accessorKey: "twinId",
    header: () => <SortableHeader title="Twin" sortField="twinName" />,
    cell: ({ row: { original } }) =>
      original.twin && (
        <div className="inline-flex max-w-48">
          <TwinResourceLink data={original.twin} withTooltip />
        </div>
      ),
  },

  authorUserId: {
    id: "authorUserId",
    accessorKey: "authorUserId",
    header: () => <SortableHeader title="Author" sortField="authorUserName" />,
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.authorUser} withTooltip />
        </div>
      ),
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },

  changedAt: {
    id: "changedAt",
    accessorKey: "changedAt",
    header: () => <SortableHeader title="Changed at" sortField="changedAt" />,
    cell: ({ row: { original } }) =>
      original.changedAt &&
      formatIntlDate(original.changedAt, "datetime-local"),
  },
};

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

  // When the list is scoped to a single twin, the twin column carries no
  // information, so it is dropped from both the table and the card-view sort.
  const columns = [
    colDefs.id,
    colDefs.text,
    ...(isFalsy(baseTwinId) ? [colDefs.twinId] : []),
    colDefs.authorUserId,
    colDefs.createdAt,
    colDefs.changedAt,
  ];

  // The card view has no clickable column headers, so the toolbar sort
  // dropdown is what keeps it sortable. It mirrors the same sort state the
  // table view's sortable headers drive.
  const sortableFields: SortableFieldOption[] = [
    { field: "createdAt", label: "Created date" },
    { field: "changedAt", label: "Changed date" },
    ...(isFalsy(baseTwinId) ? [{ field: "twinName", label: "Twin" }] : []),
    { field: "authorUserName", label: "Author" },
  ];

  // The search filters of the active query, scoped to the base twin when the
  // list is shown for a single twin.
  const resolveFilters = useCallback(
    (filters: Record<CommentFilterKeys, unknown>): CommentFilters => {
      const resolved = mapFiltersToPayload(filters);
      return {
        ...resolved,
        twinIdList: baseTwinId
          ? toArrayOfString(toArray(baseTwinId), "id")
          : resolved.twinIdList,
      };
    },
    [mapFiltersToPayload, baseTwinId]
  );

  async function fetchComments(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Comment_DETAILED>> {
    try {
      return await searchComments({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<CommentFilterKeys, unknown>
        ),
        sort,
      });
    } catch {
      toast.error("Failed to fetch comments");
      return { data: [], pagination: {} };
    }
  }

  // Server-side breakdowns backed by /private/comment/count/v1, bound to the
  // active filters: the pie charts, and the grouping of the table view, whose
  // groups open through the matching search filters. When the list is scoped
  // to a single twin the twin grouping is excluded — grouping by a constant
  // value carries no information.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<Comment_DETAILED, CommentCountGroup, CommentFilters>({
        fields: [
          ...(isFalsy(baseTwinId)
            ? [
                {
                  key: "twin",
                  label: "Twin",
                  groupField: "twinId",
                  getValue: (g: CommentCountGroup) => g.twinId,
                  getText: (g: CommentCountGroup) => g.twin?.name,
                  renderLabel: (g: CommentCountGroup) =>
                    g.twin && <TwinResourceLink data={g.twin} withTooltip />,
                  narrow: narrowBy.idList<CommentFilters>("twinIdList"),
                },
              ]
            : []),
          {
            key: "author",
            label: "Author",
            groupField: "createdByUserId",
            getValue: (g) => g.createdByUserId,
            getText: (g) => g.author?.fullName,
            renderLabel: (g) =>
              g.author && <UserResourceLink data={g.author} withTooltip />,
            narrow: narrowBy.idList<CommentFilters>("createdByUserIdList"),
          },
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<CommentFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countComment({
            filters,
            groupField: groupField as CommentCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchComments({ pagination, filters, sort }),
      }),
    [resolveFilters, countComment, searchComments, baseTwinId]
  );

  return (
    <CrudDataTable
      permissionSegment="comments"
      title={title}
      columns={columns}
      defaultVisibleColumns={columns}
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
      sortableFields={sortableFields}
      chartGroupings={chartGroupings}
      grouping={grouping}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
