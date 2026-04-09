"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useFetchDomainById } from "@/entities/domain";
import { getAuthHeaders } from "@/entities/face";
import {
  FetchTreePageParams,
  FetchTreePageResult,
  TwinClass_DETAILED,
  hydrateTwinClassFromMap,
} from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TreeSkeleton } from "@/features/ui/skeletons";
import { PrivateApiContext } from "@/shared/api";
import { cn } from "@/shared/libs";
import { Button, Input, LoadingSpinner } from "@/shared/ui";
import { Accordion } from "@/shared/ui/accordion";

type ExtendsTreeNode = {
  data: TwinClass_DETAILED;
  children: ExtendsTreeNode[];
  pageIndex: number;
  hasMore: boolean;
  isLoading?: boolean;
  hasCheckedChildren?: boolean;
  totalChildren: number;
};

type RootTreeState = {
  nodes: ExtendsTreeNode[];
  pageIndex: number;
  hasMore: boolean;
  isLoading: boolean;
};

type Props = {
  fetchTreePage: (params: FetchTreePageParams) => Promise<FetchTreePageResult>;
};

const ROOT_PAGE_SIZE = 10;
const CHILD_PAGE_SIZE = 10;
const FIELD_PREVIEW_LIMIT = 8;
const STATUS_PREVIEW_LIMIT = 6;
const MIN_SEARCH_LENGTH = 3;

type SearchRegistryItem = {
  orderKey: string;
  isMatch: boolean;
};

export function TwinClassesExtendsTreeView({ fetchTreePage }: Props) {
  const { fetchDomainById } = useFetchDomainById();

  const [rootTwinClassId, setRootTwinClassId] = useState<string | null>(null);
  const [root, setRoot] = useState<RootTreeState>({
    nodes: [],
    pageIndex: 0,
    hasMore: false,
    isLoading: false,
  });
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [searchRegistry, setSearchRegistry] = useState<
    Record<string, SearchRegistryItem>
  >({});
  const [forceExpandFields, setForceExpandFields] = useState(false);
  const [forceExpandStatuses, setForceExpandStatuses] = useState(false);
  const [collapseSignal, setCollapseSignal] = useState(0);

  const _query = {
    lazyRelation: false,
    showDomainMode: "DETAILED",
  } as const;

  useEffect(() => {
    async function loadDomain() {
      const { DomainId } = await getAuthHeaders();
      const domain = await fetchDomainById({
        domainId: DomainId,
        query: _query,
      });

      if (!domain.ancestorTwinClassId) {
        throw new Error("Domain does not have ancestorTwinClassId");
      }

      setRootTwinClassId(domain.ancestorTwinClassId);
    }

    loadDomain();
  }, [fetchDomainById]);

  useEffect(() => {
    if (!rootTwinClassId) return;

    loadRootPage(0);
  }, [rootTwinClassId]);

  async function loadRootPage(pageIndex: number) {
    if (!rootTwinClassId) return;

    setRoot((s) => ({ ...s, isLoading: true }));

    const res = await fetchTreePage({
      mode: "root",
      twinClassIdList: [rootTwinClassId],
      pagination: { pageIndex, pageSize: ROOT_PAGE_SIZE },
    });

    setRoot((s) => ({
      isLoading: false,
      pageIndex,
      hasMore: res.hasMore,
      nodes:
        pageIndex === 0
          ? mapNodes(res.data)
          : [...s.nodes, ...mapNodes(res.data)],
    }));
  }

  const isRootLoading =
    rootTwinClassId !== null && root.nodes.length === 0 && root.isLoading;
  const activeSearchQuery = searchQuery.trim();
  const trimmedSearchInput = searchInput.trim();

  const matchNodeIds = useMemo(() => {
    return Object.entries(searchRegistry)
      .filter(([, item]) => item.isMatch)
      .sort((a, b) => a[1].orderKey.localeCompare(b[1].orderKey))
      .map(([id]) => id);
  }, [searchRegistry]);

  const safeActiveMatchIndex = useMemo(() => {
    if (matchNodeIds.length === 0) return 0;
    return (
      ((activeMatchIndex % matchNodeIds.length) + matchNodeIds.length) %
      matchNodeIds.length
    );
  }, [activeMatchIndex, matchNodeIds.length]);

  const activeMatchNodeId: string | null =
    matchNodeIds.length > 0
      ? (matchNodeIds[safeActiveMatchIndex] ?? null)
      : null;

  const activeMatchPath =
    activeMatchNodeId && searchRegistry[activeMatchNodeId]
      ? searchRegistry[activeMatchNodeId].orderKey
      : null;

  const registerNodeRef = useCallback(
    (nodeId: string, element: HTMLDivElement | null) => {
      if (element) {
        nodeRefs.current[nodeId] = element;
        return;
      }

      delete nodeRefs.current[nodeId];
    },
    []
  );

  const registerSearchEntry = useCallback(
    (nodeId: string, orderKey: string, isMatch: boolean) => {
      setSearchRegistry((prev) => {
        const prevItem = prev[nodeId];

        if (
          prevItem &&
          prevItem.orderKey === orderKey &&
          prevItem.isMatch === isMatch
        ) {
          return prev;
        }

        return {
          ...prev,
          [nodeId]: { orderKey, isMatch },
        };
      });
    },
    []
  );

  const unregisterSearchEntry = useCallback((nodeId: string) => {
    setSearchRegistry((prev) => {
      if (!(nodeId in prev)) return prev;

      const next = { ...prev };
      delete next[nodeId];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!activeMatchNodeId) return;

    let frameId = 0;
    let attempts = 0;

    const tryScroll = () => {
      const target = nodeRefs.current[activeMatchNodeId];
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        frameId = requestAnimationFrame(tryScroll);
      }
    };

    frameId = requestAnimationFrame(tryScroll);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeMatchNodeId, activeMatchPath]);

  function focusPrevMatch() {
    if (matchNodeIds.length === 0) return;
    setActiveMatchIndex((index) => index - 1);
  }

  function focusNextMatch() {
    if (matchNodeIds.length === 0) return;
    setActiveMatchIndex((index) => index + 1);
  }

  function handleCollapseAll() {
    setForceExpandFields(false);
    setForceExpandStatuses(false);
    setCollapseSignal((signal) => signal + 1);
  }

  function applySearch() {
    const nextQuery = trimmedSearchInput;

    if (nextQuery.length > 0 && nextQuery.length < MIN_SEARCH_LENGTH) {
      setSearchQuery("");
      setActiveMatchIndex(0);
      return;
    }

    setSearchQuery(nextQuery);
    setActiveMatchIndex(0);
  }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
    setActiveMatchIndex(0);
  }

  return (
    <div className="mt-5">
      <div>
        <div className="bg-background/95 sticky top-0 z-20 mb-3 border-b py-2 backdrop-blur">
          <p className="font-medium">Extends tree view:</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applySearch();
                }
              }}
              placeholder="Search class"
              className="h-8 w-full max-w-[320px]"
            />
            <Button size="sm" onClick={applySearch}>
              Search
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearSearch}
              disabled={!searchQuery && !searchInput}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={focusPrevMatch}
              disabled={matchNodeIds.length === 0 || !activeSearchQuery}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={focusNextMatch}
              disabled={matchNodeIds.length === 0 || !activeSearchQuery}
            >
              Next
            </Button>
            <span className="text-muted-foreground text-xs">
              {matchNodeIds.length > 0
                ? `${safeActiveMatchIndex + 1}/${matchNodeIds.length}`
                : "0 matches"}
            </span>
            {trimmedSearchInput.length > 0 &&
              trimmedSearchInput.length < MIN_SEARCH_LENGTH && (
                <span className="text-muted-foreground text-xs">
                  Enter at least {MIN_SEARCH_LENGTH} chars
                </span>
              )}
            <Button
              size="sm"
              variant={forceExpandFields ? "default" : "outline"}
              onClick={() => setForceExpandFields((value) => !value)}
            >
              Expand all fields
            </Button>
            <Button
              size="sm"
              variant={forceExpandStatuses ? "default" : "outline"}
              onClick={() => setForceExpandStatuses((value) => !value)}
            >
              Expand all statuses
            </Button>
            <Button size="sm" variant="outline" onClick={handleCollapseAll}>
              Collapse all
            </Button>
          </div>
        </div>

        <Accordion type="multiple">
          {isRootLoading ? (
            <TreeSkeleton level={0} rows={1} withLoadMore={false} mode="card" />
          ) : (
            root.nodes.map((node) => (
              <ExtendsTreeNodeItem
                key={node.data.id}
                node={node}
                fetchTreePage={fetchTreePage}
                level={0}
                nodePath={node.data.id}
                searchQuery={activeSearchQuery}
                activeMatchNodeId={activeMatchNodeId}
                activeMatchPath={activeMatchPath}
                registerNodeRef={registerNodeRef}
                registerSearchEntry={registerSearchEntry}
                unregisterSearchEntry={unregisterSearchEntry}
                forceExpandFields={forceExpandFields}
                forceExpandStatuses={forceExpandStatuses}
                collapseSignal={collapseSignal}
              />
            ))
          )}

          {root.hasMore && !isRootLoading && (
            <TreeLoadMore
              level={0}
              onClick={() => loadRootPage(root.pageIndex + 1)}
              disabled={root.isLoading}
              count={ROOT_PAGE_SIZE}
            />
          )}
        </Accordion>
      </div>
    </div>
  );
}

function ExtendsTreeNodeItem({
  node,
  fetchTreePage,
  level = 0,
  nodePath,
  searchQuery,
  activeMatchNodeId,
  activeMatchPath,
  registerNodeRef,
  registerSearchEntry,
  unregisterSearchEntry,
  forceExpandFields,
  forceExpandStatuses,
  collapseSignal,
}: {
  node: ExtendsTreeNode;
  fetchTreePage: Props["fetchTreePage"];
  level?: number;
  nodePath: string;
  searchQuery: string;
  activeMatchNodeId: string | null;
  activeMatchPath: string | null;
  registerNodeRef: (nodeId: string, element: HTMLDivElement | null) => void;
  registerSearchEntry: (
    nodeId: string,
    orderKey: string,
    isMatch: boolean
  ) => void;
  unregisterSearchEntry: (nodeId: string) => void;
  forceExpandFields: boolean;
  forceExpandStatuses: boolean;
  collapseSignal: number;
}) {
  const api = useContext(PrivateApiContext);
  const nodeContainerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ExtendsTreeNode>(node);
  const [open, setOpen] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [detailsChecked, setDetailsChecked] = useState(false);
  const isToggleDisabled = state.isLoading;

  async function loadPage(pageIndex: number) {
    if (isToggleDisabled || state.totalChildren === 0) return;

    setState((s) => ({ ...s, isLoading: true }));

    const res = await fetchTreePage({
      mode: "extends",
      override: {
        idList: [state.data.id],
        depth: 1,
      },
      pagination: { pageIndex, pageSize: CHILD_PAGE_SIZE },
    });

    setState((s) => ({
      ...s,
      isLoading: false,
      hasCheckedChildren: true,
      pageIndex,
      hasMore: res.hasMore,
      children:
        pageIndex === 0
          ? mapNodes(res.data)
          : [...s.children, ...mapNodes(res.data)],
    }));
  }

  async function toggle() {
    if (isToggleDisabled || state.totalChildren === 0) return;

    if (!state.hasCheckedChildren) {
      await loadPage(0);
    }

    setOpen((v) => !v);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      const hasFieldDetails = Array.isArray(state.data.fields);
      const hasStatusDetails = Array.isArray(state.data.statuses);

      if (detailsChecked || (hasFieldDetails && hasStatusDetails)) {
        if (!detailsChecked) {
          setDetailsChecked(true);
        }

        return;
      }

      try {
        const { data, error } = await api.twinClass.getById({
          id: state.data.id,
          query: {
            lazyRelation: false,
            showTwinClassMode: "DETAILED",
            showTwinClass2TwinClassFieldMode: "DETAILED",
            showTwinClass2StatusMode: "DETAILED",
            showTwinClassFieldCollectionMode: "SHOW",
          },
        });

        if (error || !data?.twinClass) return;

        const detailedTwinClass = hydrateTwinClassFromMap(
          data.twinClass,
          data.relatedObjects
        );

        if (cancelled) return;

        setState((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            ...detailedTwinClass,
            fields: detailedTwinClass.fields ?? prevState.data.fields ?? [],
            statuses:
              detailedTwinClass.statuses ?? prevState.data.statuses ?? [],
          },
        }));
      } catch {
      } finally {
        if (!cancelled) {
          setDetailsChecked(true);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [
    api,
    detailsChecked,
    state.data.fields,
    state.data.id,
    state.data.statuses,
  ]);

  const isLeaf = state.totalChildren === 0;
  const fieldList = state.data.fields ?? [];
  const statusList = state.data.statuses ?? [];
  const normalizedQuery = searchQuery.toLowerCase();
  const isClassMatch =
    normalizedQuery.length > 0 &&
    `${state.data.name ?? ""} ${state.data.key ?? ""}`
      .toLowerCase()
      .includes(normalizedQuery);
  const isSearchMatch = normalizedQuery.length > 0 && isClassMatch;
  const isActiveMatch = activeMatchNodeId === state.data.id;
  const isFieldsExpanded = forceExpandFields || showAllFields;
  const isStatusesExpanded = forceExpandStatuses || showAllStatuses;
  const visibleFieldList = isFieldsExpanded
    ? fieldList
    : fieldList.slice(0, FIELD_PREVIEW_LIMIT);
  const visibleStatusList = isStatusesExpanded
    ? statusList
    : statusList.slice(0, STATUS_PREVIEW_LIMIT);
  const hiddenFieldCount = Math.max(
    fieldList.length - visibleFieldList.length,
    0
  );
  const hiddenStatusCount = Math.max(
    statusList.length - visibleStatusList.length,
    0
  );

  useEffect(() => {
    registerNodeRef(state.data.id, nodeContainerRef.current);

    return () => {
      registerNodeRef(state.data.id, null);
    };
  }, [registerNodeRef, state.data.id]);

  useEffect(() => {
    registerSearchEntry(state.data.id, nodePath, isSearchMatch);

    return () => {
      unregisterSearchEntry(state.data.id);
    };
  }, [
    isSearchMatch,
    nodePath,
    registerSearchEntry,
    state.data.id,
    unregisterSearchEntry,
  ]);

  useEffect(() => {
    if (!isSearchMatch || isLeaf || open) return;

    setOpen(true);
  }, [isLeaf, isSearchMatch, open]);

  useEffect(() => {
    if (!activeMatchPath || !activeMatchPath.startsWith(nodePath) || isLeaf) {
      return;
    }

    if (!open) {
      setOpen(true);
    }
  }, [activeMatchPath, isLeaf, nodePath, open]);

  useEffect(() => {
    setOpen(false);
    setShowAllFields(false);
    setShowAllStatuses(false);
  }, [collapseSignal]);

  return (
    <div ref={nodeContainerRef}>
      <div className="relative flex items-center gap-1 py-1 text-sm">
        {Array.from({ length: level }).map((_, i) => (
          <div key={i} className="relative w-5 self-stretch">
            <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
          </div>
        ))}

        <div className="flex min-w-0 items-start gap-2 px-1.5 py-1">
          <div
            className={cn(
              "flex h-4 w-4 cursor-pointer items-center justify-center rounded border font-mono text-xs",
              isLeaf
                ? "border-transparent"
                : "border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground",
              isToggleDisabled && "pointer-events-none opacity-50"
            )}
            onClick={!isLeaf && !isToggleDisabled ? toggle : undefined}
          >
            {!isLeaf && (open ? "−" : "+")}
          </div>

          <div
            className={cn(
              "from-background via-background to-muted/20 relative w-full max-w-[280px] min-w-0 rounded-2xl border bg-gradient-to-br px-3.5 py-3 shadow-[0_10px_34px_-28px_rgba(15,23,42,0.8)] transition-colors hover:shadow-[0_16px_38px_-30px_rgba(15,23,42,0.95)]",
              isSearchMatch &&
                "border-primary bg-primary/10 shadow-[0_0_0_2px_hsl(var(--primary)/0.55)]",
              isActiveMatch && "ring-primary/70 ring-2 ring-offset-2"
            )}
          >
            <div className="bg-primary/70 absolute inset-x-4 top-0 h-1 rounded-b-full" />

            <div className="mb-2 flex flex-wrap items-center gap-2 pt-1">
              <span className="text-muted-foreground text-[9px] font-semibold tracking-[0.24em] uppercase">
                Class
              </span>
              <TwinClassResourceLink data={state.data} withTooltip />
              {isClassMatch && (
                <span className="bg-primary/25 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  class match
                </span>
              )}

              {state.totalChildren > 0 && (
                <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  {state.totalChildren}
                </span>
              )}

              {state.isLoading && <LoadingSpinner className="h-4 w-4" />}
            </div>

            {fieldList.length > 0 && (
              <div className="mb-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-[9px] font-semibold tracking-[0.24em] uppercase">
                    Fields
                  </div>
                  <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                    {fieldList.length}
                  </span>
                </div>
                <div className="flex flex-wrap items-start gap-1.5">
                  {visibleFieldList.map((field) => (
                    <TwinClassFieldResourceLink
                      key={field.id}
                      data={field as TwinClassField_DETAILED}
                      withTooltip
                    />
                  ))}
                  {hiddenFieldCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllFields(true)}
                      disabled={forceExpandFields}
                      className="bg-muted text-muted-foreground hover:text-foreground inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
                    >
                      +{hiddenFieldCount} more
                    </button>
                  )}
                  {showAllFields &&
                    !forceExpandFields &&
                    fieldList.length > FIELD_PREVIEW_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setShowAllFields(false)}
                        className="bg-muted text-muted-foreground hover:text-foreground inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
                      >
                        Hide
                      </button>
                    )}
                </div>
              </div>
            )}

            {statusList.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-[9px] font-semibold tracking-[0.24em] uppercase">
                    Statuses
                  </div>
                  <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                    {statusList.length}
                  </span>
                </div>
                <div className="flex flex-wrap items-start gap-1.5">
                  {visibleStatusList.map((status) => (
                    <TwinClassStatusResourceLink
                      key={status.id}
                      data={status}
                      withTooltip
                    />
                  ))}
                  {hiddenStatusCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllStatuses(true)}
                      disabled={forceExpandStatuses}
                      className="bg-muted text-muted-foreground hover:text-foreground inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
                    >
                      +{hiddenStatusCount} more
                    </button>
                  )}
                  {showAllStatuses &&
                    !forceExpandStatuses &&
                    statusList.length > STATUS_PREVIEW_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setShowAllStatuses(false)}
                        className="bg-muted text-muted-foreground hover:text-foreground inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
                      >
                        Hide
                      </button>
                    )}
                </div>
              </div>
            )}

            {!fieldList.length && !statusList.length && !detailsChecked && (
              <div className="text-muted-foreground text-xs">
                Loading class details...
              </div>
            )}

            {!fieldList.length && !statusList.length && detailsChecked && (
              <div className="text-muted-foreground text-xs">
                No fields and statuses
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="flex flex-col">
          {state.children.map((child, index) => (
            <ExtendsTreeNodeItem
              key={child.data.id}
              node={child}
              fetchTreePage={fetchTreePage}
              level={level + 1}
              nodePath={`${nodePath}.${index}.${child.data.id}`}
              searchQuery={searchQuery}
              activeMatchNodeId={activeMatchNodeId}
              activeMatchPath={activeMatchPath}
              registerNodeRef={registerNodeRef}
              registerSearchEntry={registerSearchEntry}
              unregisterSearchEntry={unregisterSearchEntry}
              forceExpandFields={forceExpandFields}
              forceExpandStatuses={forceExpandStatuses}
              collapseSignal={collapseSignal}
            />
          ))}

          {state.hasMore && (
            <TreeLoadMore
              level={level + 1}
              onClick={() => loadPage(state.pageIndex + 1)}
              disabled={state.isLoading}
              count={CHILD_PAGE_SIZE}
            />
          )}

          {state.isLoading && (
            <TreeSkeleton
              level={level + 1}
              rows={CHILD_PAGE_SIZE}
              withLoadMore={false}
              mode="card"
            />
          )}
        </div>
      )}
    </div>
  );
}

function mapNodes(data: TwinClass_DETAILED[]): ExtendsTreeNode[] {
  return data.map((tc) => {
    const totalChildren = tc.extendsHierarchyCounterDirectChildren ?? 0;

    return {
      data: tc,
      children: [],
      pageIndex: 0,
      totalChildren,
      hasMore: totalChildren > CHILD_PAGE_SIZE,
      hasCheckedChildren: totalChildren === 0,
    };
  });
}

function TreeLoadMore({
  level,
  onClick,
  disabled,
  count,
}: {
  level: number;
  onClick: () => void;
  disabled?: boolean;
  count: number;
}) {
  return (
    <div className="relative flex items-center gap-1 py-1 text-sm">
      {Array.from({ length: level }).map((_, i) => (
        <div key={i} className="relative w-5 self-stretch">
          <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
        </div>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={!disabled ? onClick : undefined}
        className={cn(
          "group flex items-center gap-2 rounded-md px-1.5 py-1",
          "text-muted-foreground transition-colors",
          disabled
            ? "pointer-events-none opacity-50"
            : "hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border border-dashed",
            "border-muted-foreground/60 text-muted-foreground",
            "font-mono text-xs",
            "transition-colors",
            "group-hover:border-foreground group-hover:text-foreground"
          )}
        >
          …
        </div>

        <span
          className={cn(
            "text-xs font-medium",
            "text-muted-foreground/70",
            "transition-colors",
            "group-hover:text-foreground"
          )}
        >
          +{count} more
        </span>
      </button>
    </div>
  );
}
