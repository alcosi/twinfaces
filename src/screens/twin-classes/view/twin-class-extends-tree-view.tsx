"use client";

import { useEffect, useState } from "react";

import { useFetchDomainById } from "@/entities/domain";
import { getAuthHeaders } from "@/entities/face";
import {
  FetchTreePageParams,
  FetchTreePageResult,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TreeSkeleton } from "@/features/ui/skeletons";
import { cn } from "@/shared/libs";
import { LoadingSpinner } from "@/shared/ui";
import { Accordion } from "@/shared/ui/accordion";

type ExtendsTreeNode = {
  data: TwinClass_DETAILED;

  children: ExtendsTreeNode[];
  pageIndex: number;
  hasMore: boolean;

  isLoading?: boolean;
  hasCheckedChildren?: boolean;
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

export function TwinClassesExtendsTreeView({ fetchTreePage }: Props) {
  const { fetchDomainById } = useFetchDomainById();

  const [rootTwinClassId, setRootTwinClassId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDomain() {
      const { DomainId } = await getAuthHeaders();
      const domain = await fetchDomainById({
        id: DomainId,
      });

      if (!domain.ancestorTwinClassId) {
        throw new Error("Domain does not have ancestorTwinClassId");
      }

      setRootTwinClassId(domain.ancestorTwinClassId);
    }

    loadDomain();
  }, [fetchDomainById]);
  const [root, setRoot] = useState<RootTreeState>({
    nodes: [],
    pageIndex: 0,
    hasMore: false,
    isLoading: false,
  });

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
      pagination: { pageIndex, pageSize: 10 },
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

  return (
    <div className="mt-5 max-w-4xl">
      <div>
        <p className="font-medium">Extends tree view:</p>
        <Accordion type="multiple">
          {isRootLoading ? (
            <TreeSkeleton level={0} rows={1} withLoadMore={false} />
          ) : (
            root.nodes.map((node) => (
              <ExtendsTreeNodeItem
                key={node.data.id}
                node={node}
                fetchTreePage={fetchTreePage}
                level={0}
              />
            ))
          )}

          {root.hasMore && !isRootLoading && (
            <TreeLoadMore
              level={0}
              onClick={() => loadRootPage(root.pageIndex + 1)}
              disabled={root.isLoading}
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
}: {
  node: ExtendsTreeNode;
  fetchTreePage: Props["fetchTreePage"];
  level?: number;
}) {
  const [state, setState] = useState<ExtendsTreeNode>(node);
  const [open, setOpen] = useState(false);
  const isToggleDisabled = state.isLoading;

  async function loadPage(pageIndex: number) {
    if (isToggleDisabled) return;

    setState((s) => ({ ...s, isLoading: true }));

    const res = await fetchTreePage({
      mode: "extends",
      override: {
        idList: [state.data.id],
        depth: 1,
      },
      pagination: { pageIndex, pageSize: 10 },
    });

    setState((s) => ({
      ...s,
      isLoading: false,
      hasCheckedChildren: true,
      pageIndex,
      hasMore: res.hasMore,
      children:
        pageIndex === 0
          ? res.data.map((tc) => ({
              data: tc,
              children: [],
              pageIndex: 0,
              hasMore: false,
              hasCheckedChildren: false,
            }))
          : [
              ...s.children,
              ...res.data.map((tc) => ({
                data: tc,
                children: [],
                pageIndex: 0,
                hasMore: false,
                hasCheckedChildren: false,
              })),
            ],
    }));
  }

  async function toggle() {
    if (isToggleDisabled) return;

    if (!state.hasCheckedChildren) {
      await loadPage(0);
    }
    setOpen((v) => !v);
  }

  const isLeaf = state.hasCheckedChildren && state.children.length === 0;

  return (
    <div>
      <div className="relative flex items-center gap-1 py-1 text-sm">
        {Array.from({ length: level }).map((_, i) => (
          <div key={i} className="relative w-5 self-stretch">
            <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
          </div>
        ))}

        <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1">
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border font-mono text-xs",
              isLeaf
                ? "border-transparent"
                : "border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground",
              isToggleDisabled && "pointer-events-none opacity-50"
            )}
            onClick={!isLeaf && !isToggleDisabled ? toggle : undefined}
          >
            {!isLeaf && (open ? "−" : "+")}
          </div>

          <TwinClassResourceLink data={state.data} withTooltip />

          {state.isLoading && <LoadingSpinner className="h-4 w-4" />}
        </div>
      </div>

      {open && (
        <div className="flex flex-col">
          {state.children.map((child) => (
            <ExtendsTreeNodeItem
              key={child.data.id}
              node={child}
              fetchTreePage={fetchTreePage}
              level={level + 1}
            />
          ))}

          {state.hasMore && (
            <TreeLoadMore
              level={level + 1}
              onClick={() => loadPage(state.pageIndex + 1)}
              disabled={state.isLoading}
            />
          )}

          {state.isLoading && (
            <TreeSkeleton level={level + 1} rows={10} withLoadMore={false} />
          )}
        </div>
      )}
    </div>
  );
}

function mapNodes(data: TwinClass_DETAILED[]): ExtendsTreeNode[] {
  return data.map((tc) => ({
    data: tc,
    children: [],
    pageIndex: 0,
    hasMore: false,
    hasCheckedChildren: false,
  }));
}

function TreeLoadMore({
  level,
  onClick,
  disabled,
}: {
  level: number;
  onClick: () => void;
  disabled?: boolean;
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
          +10 more
        </span>
      </button>
    </div>
  );
}
