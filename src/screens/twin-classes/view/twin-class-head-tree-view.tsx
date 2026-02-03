"use client";

import { useEffect, useState } from "react";

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

type HeadTreeNode = {
  data: TwinClass_DETAILED;
  children: HeadTreeNode[];
  pageIndex: number;
  hasMore: boolean;
  isLoading?: boolean;
  hasCheckedChildren?: boolean;
  totalChildren: number;
};

type RootTreeState = {
  nodes: HeadTreeNode[];
  pageIndex: number;
  hasMore: boolean;
  isLoading: boolean;
};

type Props = {
  fetchTreePage: (params: FetchTreePageParams) => Promise<FetchTreePageResult>;
};

const ROOT_PAGE_SIZE = 50;
const CHILD_PAGE_SIZE = 10;

export function TwinClassesHeadTreeView({ fetchTreePage }: Props) {
  const [root, setRoot] = useState<RootTreeState>({
    nodes: [],
    pageIndex: 0,
    hasMore: false,
    isLoading: false,
  });

  useEffect(() => {
    loadRootPage(0);
  }, []);

  async function loadRootPage(pageIndex: number) {
    setRoot((s) => ({ ...s, isLoading: true }));

    const res = await fetchTreePage({
      mode: "root",
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

  const isInitialRootLoading = root.nodes.length === 0 && root.isLoading;

  return (
    <div className="mt-5 max-w-4xl">
      <div>
        <p className="font-medium">Head tree view:</p>

        <Accordion type="multiple">
          {isInitialRootLoading ? (
            <TreeSkeleton level={0} rows={50} withLoadMore={true} />
          ) : (
            root.nodes.map((node, index) => (
              <HeadTreeNodeItem
                key={node.data.id}
                node={node}
                fetchTreePage={fetchTreePage}
                level={0}
                isLast={index === root.nodes.length - 1}
              />
            ))
          )}
          {root.hasMore && !root.isLoading && (
            <TreeLoadMore
              level={0}
              onClick={() => loadRootPage(root.pageIndex + 1)}
              disabled={root.isLoading}
              count={ROOT_PAGE_SIZE}
            />
          )}

          {root.isLoading && root.nodes.length > 0 && (
            <TreeSkeleton level={0} rows={ROOT_PAGE_SIZE} withLoadMore={true} />
          )}
        </Accordion>
      </div>
    </div>
  );
}

function HeadTreeNodeItem({
  node,
  fetchTreePage,
  level = 0,
  isLast,
}: {
  node: HeadTreeNode;
  fetchTreePage: Props["fetchTreePage"];
  level?: number;
  isLast: boolean;
}) {
  const [state, setState] = useState<HeadTreeNode>(node);
  const [open, setOpen] = useState(false);
  const isToggleDisabled = state.isLoading;

  async function loadPage(pageIndex: number) {
    if (state.isLoading || state.totalChildren === 0) return;

    setState((s) => ({ ...s, isLoading: true }));

    const res = await fetchTreePage({
      mode: "head",
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

  const isLeaf = state.totalChildren === 0;

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

          {state.totalChildren > 0 && (
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
              {state.totalChildren}
            </span>
          )}

          {state.isLoading && <LoadingSpinner className="h-4 w-4" />}
        </div>
      </div>

      {open && (
        <div className="flex flex-col">
          {state.children.map((child, index) => (
            <HeadTreeNodeItem
              key={child.data.id}
              node={child}
              fetchTreePage={fetchTreePage}
              level={level + 1}
              isLast={index === state.children.length - 1}
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
            />
          )}
        </div>
      )}
    </div>
  );
}

function mapNodes(data: TwinClass_DETAILED[]): HeadTreeNode[] {
  return data.map((tc) => {
    const totalChildren = tc.headHierarchyCounterDirectChildren ?? 0;

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
