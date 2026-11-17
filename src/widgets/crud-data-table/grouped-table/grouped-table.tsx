"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import {
  CSSProperties,
  ForwardedRef,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { SortV1 } from "@/shared/api";
import { cn, fixedForwardRef } from "@/shared/libs";
import { Badge } from "@/shared/ui/badge";
import { TableBody, TableCell, TableRow } from "@/shared/ui/table";

import { DataTableHandle, DataTableRow, SortProvider } from "../data-table";
import { DataTableGridHeader, DataTableGridRow } from "../data-table/views";
import {
  GroupBucket,
  GroupPathStep,
  TableGroupField,
  TableGrouping,
  TableQueryContext,
} from "./types";
import { useInfinitePages } from "./use-infinite-pages";

const GROUPS_PAGE_SIZE = 50;
/** React key of the group of rows with no value. */
const NO_VALUE_KEY = "∅";
const ROWS_PAGE_SIZE = 25;
/** Horizontal step of one group level. */
const INDENT_PX = 20;
/** Left padding of a table cell (`p-2`). */
const CELL_PADDING_PX = 8;
const CHEVRON_PX = 16;
/**
 * Height of a group row. Fixed, so that the sticky path above the rows can
 * give every level a slot of its own.
 */
const GROUP_ROW_HEIGHT_PX = 40;

/**
 * Indents a cell to `depth` levels and draws a vertical guide under the
 * chevron of each enclosing group, so nested rows read as a tree.
 */
function nestedCellStyle(depth: number): CSSProperties {
  const levels = Array.from({ length: depth }, (_, level) => level);

  return {
    paddingLeft: CELL_PADDING_PX + depth * INDENT_PX,
    ...(depth > 0 && {
      backgroundImage: levels
        .map(() => "linear-gradient(var(--color-border), var(--color-border))")
        .join(", "),
      backgroundSize: levels.map(() => "1px 100%").join(", "),
      backgroundPosition: levels
        .map(
          (level) =>
            `${CELL_PADDING_PX + level * INDENT_PX + CHEVRON_PX / 2}px 0`
        )
        .join(", "),
      backgroundRepeat: "no-repeat",
    }),
  };
}

/** What the sticky path needs to know about a rendered group row. */
type GroupInfo = {
  depth: number;
  fieldLabel: string;
  label: ReactNode;
  count: number;
  open: boolean;
  toggle: () => void;
};

/**
 * The group rows currently rendered, keyed by the id their row carries in
 * `data-group-id`. Kept outside React state: groups come and go as they are
 * opened and loaded, and only the sticky path cares — it subscribes.
 */
function createGroupRegistry() {
  const groups = new Map<string, GroupInfo>();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    get: (id: string) => groups.get(id),
    set(id: string, info: GroupInfo) {
      groups.set(id, info);
      notify();
    },
    delete(id: string) {
      groups.delete(id);
      notify();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

type GroupRegistry = ReturnType<typeof createGroupRegistry>;

type GroupedTableProps<TData extends DataTableRow<TData>, TValue> = {
  grouping: TableGrouping<TData>;
  /** Selected group fields, outermost level first. */
  fieldKeys: string[];
  context: TableQueryContext;
  columns: ColumnDef<TData, TValue>[];
  getRowId: (row: TData, index: number) => string;
  onRowClick?: (row: TData) => void;
  getRowHref?: (row: TData) => string | undefined;
  columnManager?: ReactNode;
  sort?: SortV1;
  onSortChange?: (sort: SortV1 | undefined) => void;
};

type GroupTreeContextValue<TData extends DataTableRow<TData>> = {
  grouping: TableGrouping<TData>;
  fields: TableGroupField[];
  context: TableQueryContext;
  columns: ColumnDef<TData, any>[];
  getRowId: (row: TData, index: number) => string;
  onRowClick?: (row: TData) => void;
  getRowHref?: (row: TData) => string | undefined;
  colSpan: number;
  /** The scroll container, observed for infinite loading. */
  scrollRoot: HTMLElement | null;
  registry: GroupRegistry;
};

const GroupTreeContext = createContext<GroupTreeContextValue<any> | null>(null);

function useGroupTree<TData extends DataTableRow<TData>>() {
  const value = useContext(GroupTreeContext);
  if (!value) throw new Error("useGroupTree must be used within GroupedTable");
  return value as GroupTreeContextValue<TData>;
}

export const GroupedTable = fixedForwardRef(GroupedTableInternal);

/**
 * The table view grouped on the server. Each level lists its groups through
 * the count endpoint, narrowed by the groups opened above it, and is only
 * requested when its parent group is opened. The last level holds the rows,
 * loaded page by page as the user scrolls — the grouped view has no pager.
 */
function GroupedTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    grouping,
    fieldKeys,
    context,
    columns,
    getRowId,
    onRowClick,
    getRowHref,
    columnManager,
    sort,
    onSortChange,
  }: GroupedTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Bumped to reload the whole tree from its first level.
  const [version, setVersion] = useState(0);
  const [registry] = useState(createGroupRegistry);

  useImperativeHandle(ref, () => ({
    refresh: () => setVersion((v) => v + 1),
    // There are no pages to go back to: whatever asks for a reset (a new
    // query, filter or sort) arrives as a new `context`, which rebuilds the
    // tree by itself — reloading here as well would request everything twice.
    resetPage: () => {},
  }));

  // The sticky path sits right under the table header, whose height follows
  // its labels.
  useEffect(() => {
    const head = scrollRoot?.querySelector("thead");
    if (!head) return;

    const observer = new ResizeObserver(() =>
      setHeaderHeight(head.getBoundingClientRect().height)
    );
    observer.observe(head);
    return () => observer.disconnect();
  }, [scrollRoot]);

  // Only renders the header; the rows live in the groups below it.
  const headerTable = useReactTable<TData>({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fields = useMemo(
    () =>
      fieldKeys
        .map((key) => grouping.fields.find((field) => field.key === key))
        .filter((field): field is TableGroupField => Boolean(field)),
    [fieldKeys, grouping.fields]
  );

  // Anything that changes what the groups contain rebuilds the tree, closing
  // every opened group: their counts no longer hold. `context` is memoized by
  // the table, so a new object means a new query, filter or sort.
  const contextIdRef = useRef({ context, id: 0 });
  if (contextIdRef.current.context !== context) {
    contextIdRef.current = { context, id: contextIdRef.current.id + 1 };
  }
  const contextId = contextIdRef.current.id;
  const treeKey = `${fieldKeys.join("|")}#${contextId}#${version}`;

  const colSpan = Math.max(headerTable.getVisibleLeafColumns().length, 1);

  const treeContext = useMemo<GroupTreeContextValue<TData>>(
    () => ({
      grouping,
      fields,
      context,
      columns,
      getRowId,
      onRowClick,
      getRowHref,
      colSpan,
      scrollRoot,
      registry,
    }),
    [
      grouping,
      fields,
      context,
      columns,
      getRowId,
      onRowClick,
      getRowHref,
      colSpan,
      scrollRoot,
      registry,
    ]
  );

  return (
    <SortProvider sort={sort} onSortChange={onSortChange ?? (() => {})}>
      <div
        ref={setScrollRoot}
        className="force-scrollbar-x border-border relative isolate mb-2 min-h-0 flex-initial overflow-auto rounded-md border"
      >
        {scrollRoot && (
          <StickyGroupPath
            scrollRoot={scrollRoot}
            registry={registry}
            headerHeight={headerHeight}
          />
        )}

        <table className="w-full caption-bottom text-sm">
          <DataTableGridHeader
            table={headerTable}
            columnManager={columnManager}
          />
          <GroupTreeContext.Provider value={treeContext}>
            <TableBody key={treeKey}>
              <GroupLevel path={[]} />
            </TableBody>
          </GroupTreeContext.Provider>
        </table>
      </div>
    </SortProvider>
  );
}

/** The groups of one level, under the groups opened along `path`. */
function GroupLevel({ path }: { path: GroupPathStep[] }) {
  const { grouping, fields, context, colSpan } = useGroupTree();
  const depth = path.length;
  const field = fields[depth]!;

  const { items, loading, failed, hasMore, loadMore } =
    useInfinitePages<GroupBucket>(
      (offset, limit) =>
        grouping.countGroups({
          fieldKey: field.key,
          path,
          offset,
          limit,
          context,
        }),
      GROUPS_PAGE_SIZE,
      (bucket) => bucket.value ?? NO_VALUE_KEY
    );

  if (!loading && !failed && items.length === 0) {
    return depth === 0 ? (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="text-muted-foreground h-24 text-center"
        >
          No results.
        </TableCell>
      </TableRow>
    ) : null;
  }

  return (
    <>
      {items.map((bucket) => (
        <GroupNode
          key={bucket.value ?? NO_VALUE_KEY}
          field={field}
          bucket={bucket}
          path={path}
        />
      ))}
      <LoadMoreRow
        depth={depth}
        loading={loading}
        failed={failed}
        hasMore={hasMore}
        onLoadMore={loadMore}
        what="groups"
      />
    </>
  );
}

/** The line a group row and its sticky copy share. */
function GroupRowContent({
  open,
  expandable = true,
  fieldLabel,
  label,
  count,
}: {
  open: boolean;
  expandable?: boolean;
  fieldLabel: string;
  label: ReactNode;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {!expandable ? (
        // Keeps the label in line with the groups that can be opened.
        <span className="h-4 w-4 shrink-0" />
      ) : open ? (
        <ChevronDown className="h-4 w-4 shrink-0" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0" />
      )}
      <span className="text-muted-foreground">{fieldLabel}:</span>
      <span
        className="font-semibold"
        // A group label may be a resource link; following it must not also
        // toggle the group.
        onClick={(event) => event.stopPropagation()}
      >
        {label}
      </span>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}

/** A group row and, once opened, whatever lies under it. */
function GroupNode({
  field,
  bucket,
  path,
}: {
  field: TableGroupField;
  bucket: GroupBucket;
  path: GroupPathStep[];
}) {
  const { fields, colSpan, registry } = useGroupTree();
  const id = useId();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const expandable = bucket.expandable !== false;

  const depth = path.length;
  const childPath = [...path, { fieldKey: field.key, value: bucket.value }];
  const isLastLevel = depth === fields.length - 1;

  useEffect(() => {
    registry.set(id, {
      depth,
      fieldLabel: field.label,
      label: bucket.label,
      count: bucket.count,
      open,
      toggle,
    });
    return () => registry.delete(id);
  }, [registry, id, depth, field.label, bucket, open, toggle]);

  return (
    <>
      <TableRow
        role={expandable ? "button" : undefined}
        aria-expanded={expandable ? open : undefined}
        data-group-id={id}
        onClick={expandable ? toggle : undefined}
        title={
          expandable
            ? undefined
            : "This group can't be opened — no filter for it"
        }
        className={cn(
          "bg-muted/40",
          expandable && "hover:bg-muted/70 cursor-pointer"
        )}
      >
        <TableCell
          colSpan={colSpan}
          className="py-0"
          style={{
            ...nestedCellStyle(depth),
            height: GROUP_ROW_HEIGHT_PX,
          }}
        >
          <GroupRowContent
            open={open}
            expandable={expandable}
            fieldLabel={field.label}
            label={bucket.label}
            count={bucket.count}
          />
        </TableCell>
      </TableRow>

      {open &&
        (isLastLevel ? (
          <GroupRows path={childPath} />
        ) : (
          <GroupLevel path={childPath} />
        ))}
    </>
  );
}

/** The rows of a last-level group, narrowed by the whole path. */
function GroupRows<TData extends DataTableRow<TData>>({
  path,
}: {
  path: GroupPathStep[];
}) {
  const { grouping, context, columns, getRowId, onRowClick, getRowHref } =
    useGroupTree<TData>();

  const { items, loading, failed, hasMore, loadMore } = useInfinitePages<TData>(
    async (offset, limit) => {
      const response = await grouping.fetchRows({
        path,
        // Offsets are always multiples of the page size here.
        pagination: { pageIndex: Math.floor(offset / limit), pageSize: limit },
        context,
      });
      return {
        items: response.data,
        total: response.pagination?.total ?? response.data.length,
      };
    },
    ROWS_PAGE_SIZE,
    (row) => getRowId(row, -1)
  );

  const table = useReactTable<TData>({
    data: items,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const firstCellStyle = nestedCellStyle(path.length);

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <DataTableGridRow
          key={row.id}
          row={row}
          onRowClick={onRowClick}
          getRowHref={getRowHref}
          firstCellStyle={firstCellStyle}
        />
      ))}
      <LoadMoreRow
        depth={path.length}
        loading={loading}
        failed={failed}
        hasMore={hasMore}
        onLoadMore={loadMore}
        what="rows"
      />
    </>
  );
}

/**
 * The tail of a list being loaded: a spinner while a page is on its way, and
 * otherwise — while there is more — a sentinel that asks for the next page as
 * soon as it scrolls into view. It doubles as a button for when it is already
 * in view and the observer has nothing left to report.
 */
function LoadMoreRow({
  depth,
  loading,
  failed,
  hasMore,
  onLoadMore,
  what,
}: {
  depth: number;
  loading: boolean;
  failed: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  what: "groups" | "rows";
}) {
  const { colSpan, scrollRoot } = useGroupTree();
  const rowRef = useRef<HTMLTableRowElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const waiting = hasMore && !loading && !failed;

  useEffect(() => {
    const target = rowRef.current;
    if (!waiting || !target) return;

    // Re-created after every page: if the sentinel is still in view once the
    // page has rendered, the observer reports it straight away and the next
    // page follows, until the visible area is filled.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      { root: scrollRoot, rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [waiting, scrollRoot]);

  if (!loading && !failed && !hasMore) return null;

  return (
    <TableRow ref={rowRef} className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="py-2"
        style={nestedCellStyle(depth)}
      >
        <div
          className="text-muted-foreground flex items-center gap-2 text-xs"
          style={{ paddingLeft: CHEVRON_PX + 8 }}
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading {what}…
            </>
          ) : (
            <button
              type="button"
              className={cn(
                "hover:text-foreground underline-offset-2 hover:underline",
                failed && "text-destructive"
              )}
              onClick={onLoadMore}
            >
              {failed ? `Failed to load ${what} — retry` : `Load more ${what}`}
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * The open groups the rows at the top of the view belong to, pinned under the
 * table header — one slot per level — so a long group never loses its title.
 *
 * Plain `position: sticky` on the group rows can't do this: a table row sticks
 * within the whole table, not within its group, so the header of a group that
 * has ended would stay pinned over the next one. Instead the path is worked out
 * from the scroll position: a group row that has scrolled up to its level's
 * slot takes that slot and clears the deeper ones; a closed one just clears.
 */
function StickyGroupPath({
  scrollRoot,
  registry,
  headerHeight,
}: {
  scrollRoot: HTMLElement;
  registry: GroupRegistry;
  headerHeight: number;
}) {
  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    let frame = 0;

    function compute() {
      const rootTop = scrollRoot.getBoundingClientRect().top;
      const next: string[] = [];

      for (const row of scrollRoot.querySelectorAll<HTMLElement>(
        "tr[data-group-id]"
      )) {
        const id = row.dataset.groupId!;
        const info = registry.get(id);
        if (!info) continue;

        const slot = headerHeight + info.depth * GROUP_ROW_HEIGHT_PX;
        const top = row.getBoundingClientRect().top - rootTop;
        // Rows come in visual order, and a group row sits at least one row
        // below its parent, whose slot is one row higher — so the first row
        // short of its slot ends the walk.
        if (top >= slot) break;

        next.length = info.depth;
        if (info.open) next[info.depth] = id;
      }

      setPath((prev) =>
        prev.length === next.length && prev.every((id, i) => id === next[i])
          ? prev
          : next
      );
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    }

    const table = scrollRoot.querySelector("table");
    const resizeObserver = new ResizeObserver(schedule);
    if (table) resizeObserver.observe(table);
    scrollRoot.addEventListener("scroll", schedule, { passive: true });
    const unsubscribe = registry.subscribe(schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scrollRoot.removeEventListener("scroll", schedule);
      unsubscribe();
    };
  }, [scrollRoot, registry, headerHeight]);

  // Closing a group from its pinned copy brings its own row back into the
  // slot, so the view stays on the group the user just folded.
  function collapse(id: string, info: GroupInfo) {
    const row = scrollRoot.querySelector<HTMLElement>(
      `tr[data-group-id="${CSS.escape(id)}"]`
    );
    info.toggle();

    requestAnimationFrame(() => {
      if (!row?.isConnected) return;
      const slot = headerHeight + info.depth * GROUP_ROW_HEIGHT_PX;
      const top =
        row.getBoundingClientRect().top -
        scrollRoot.getBoundingClientRect().top;
      scrollRoot.scrollTop += top - slot;
    });
  }

  const pinned = path
    .filter(Boolean)
    .map((id) => ({ id, info: registry.get(id) }))
    .filter((entry): entry is { id: string; info: GroupInfo } =>
      Boolean(entry.info)
    );

  if (pinned.length === 0) return null;

  return (
    // Zero-height and first in the scroll container: it takes no room in the
    // layout, and sticks to the header's bottom edge and the left edge while
    // the table scrolls under it in both directions.
    <div
      className="sticky left-0 z-[25] h-0 w-full"
      style={{ top: headerHeight }}
    >
      <div className="absolute inset-x-0 top-0 shadow-sm">
        {pinned.map(({ id, info }) => (
          <div
            key={id}
            role="button"
            title="Collapse group"
            onClick={() => collapse(id, info)}
            className="bg-background border-border group relative flex cursor-pointer items-center border-b text-sm"
            style={{
              ...nestedCellStyle(info.depth),
              height: GROUP_ROW_HEIGHT_PX,
            }}
          >
            {/* The tint of a group row, over an opaque base the rows
                scrolling underneath can't show through. */}
            <div className="bg-muted/40 group-hover:bg-muted/70 pointer-events-none absolute inset-0" />
            <div className="relative">
              <GroupRowContent
                open={info.open}
                fieldLabel={info.fieldLabel}
                label={info.label}
                count={info.count}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
