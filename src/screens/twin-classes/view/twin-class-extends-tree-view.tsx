"use client";

import { useEffect, useState } from "react";

import {
  TwinClassFiltersHierarchyOverride,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { cn } from "@/shared/libs";
import { LoadingSpinner } from "@/shared/ui";
import { Accordion } from "@/shared/ui/accordion";

type ExtendsTreeNode = {
  data: TwinClass_DETAILED;
  children?: ExtendsTreeNode[];
  isLoading?: boolean;
  hasCheckedChildren?: boolean;
};

type Props = {
  fetchTree: (
    override: TwinClassFiltersHierarchyOverride
  ) => Promise<TwinClass_DETAILED[]>;
};

const EXTENDS_ROOT_ID = "3a2fcc3a-3f53-4ba9-b7ab-0b1ae1635be4";

export function TwinClassesExtendsTreeView({ fetchTree }: Props) {
  const [rootNodes, setRootNodes] = useState<ExtendsTreeNode[]>([]);
  const [loadingRoot, setLoadingRoot] = useState(false);

  useEffect(() => {
    loadRoot();
  }, []);

  async function loadRoot() {
    setLoadingRoot(true);

    const data = await fetchTree({
      idList: [EXTENDS_ROOT_ID],
      depth: 1,
    });

    setRootNodes(data.map((tc) => ({ data: tc })));
    setLoadingRoot(false);
  }

  if (loadingRoot) {
    return <div className="text-muted-foreground p-6">Loading tree…</div>;
  }

  return (
    <div className="max-w-4xl">
      <Accordion type="multiple">
        {rootNodes.map((node) => (
          <ExtendsTreeNodeItem
            key={node.data.id}
            node={node}
            fetchTree={fetchTree}
          />
        ))}
      </Accordion>
    </div>
  );
}

function ExtendsTreeNodeItem({
  node,
  fetchTree,
  level = 0,
}: {
  node: ExtendsTreeNode;
  fetchTree: Props["fetchTree"];
  level?: number;
}) {
  const [state, setState] = useState<ExtendsTreeNode>(node);
  const [open, setOpen] = useState(false);

  async function toggle() {
    if (!state.hasCheckedChildren) {
      setState((s) => ({ ...s, isLoading: true }));

      const data = await fetchTree({
        idList: [state.data.id],
        depth: 1,
      });

      setState((s) => ({
        ...s,
        isLoading: false,
        hasCheckedChildren: true,
        children: data.map((tc) => ({ data: tc })),
      }));
    }

    setOpen((v) => !v);
  }

  const isLeaf =
    state.hasCheckedChildren && (state.children?.length ?? 0) === 0;

  return (
    <div>
      <div className="relative flex items-center gap-1 py-1 text-sm">
        {Array.from({ length: level }).map((_, i) => (
          <div key={i} className="relative w-5 self-stretch">
            <div className="bg-border absolute top-0 bottom-0 left-2 w-px" />
          </div>
        ))}

        <div className="hover:bg-muted/50 flex items-center gap-2 rounded-md px-1.5 py-1">
          <div
            className={cn(
              "flex h-4 w-4 cursor-pointer items-center justify-center rounded border font-mono text-xs",
              isLeaf
                ? "border-transparent"
                : "border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
            onClick={!isLeaf ? toggle : undefined}
          >
            {!isLeaf && (open ? "−" : "+")}
          </div>

          <TwinClassResourceLink data={state.data} withTooltip />

          {state.isLoading && <LoadingSpinner className="h-4 w-4" />}
        </div>
      </div>

      {open && state.children && (
        <div className="flex flex-col">
          {state.children.map((child) => (
            <ExtendsTreeNodeItem
              key={child.data.id}
              node={child}
              fetchTree={fetchTree}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
