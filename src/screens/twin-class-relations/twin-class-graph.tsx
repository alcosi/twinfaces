"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  Handle,
  MarkerType,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { hydrateLinkFromMap } from "@/entities/link";
import {
  TwinClassContext,
  TwinClass_DETAILED,
  useTwinClassSearch,
} from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PrivateApiContext } from "@/shared/api";
import { cn } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

type GraphRole = "center" | "head" | "child" | "backward" | "forward";

type ClassGraphNodeData = {
  twinClass: TwinClass_DETAILED;
  role: GraphRole;
  onHeightChange?: (nodeId: string, height: number) => void;
};
type ClassGraphFlowNode = Node<ClassGraphNodeData, "classNode">;

const NODE_WIDTH = 280;
const ESTIMATED_NODE_HEIGHT = 320;
const VERTICAL_GAP = 90;
const CHILD_GAP_X = 360;
const SIDE_X = 640;
const SIDE_ROW_GAP = 70;
const SIDE_BOTTOM_CLEARANCE_FROM_CHILDREN = 110;
const FIELD_LIMIT = 4;
const STATUS_LIMIT = 4;
const EDGE_ARROW_WIDTH = 22;
const EDGE_ARROW_HEIGHT = 22;
const EDGE_STROKE_WIDTH = 1.8;

const nodeTypes = {
  classNode: ClassGraphNode,
};

const HANDLE_IDS = {
  sourceTop: "source-top",
  sourceBottom: "source-bottom",
  sourceLeft: "source-left",
  sourceRight: "source-right",
  targetTop: "target-top",
  targetBottom: "target-bottom",
  targetLeft: "target-left",
  targetRight: "target-right",
} as const;

function uniqueById(list: TwinClass_DETAILED[]): TwinClass_DETAILED[] {
  const seen = new Set<string>();
  const result: TwinClass_DETAILED[] = [];

  list.forEach((item) => {
    const id = item?.id;
    if (!id || seen.has(id)) return;
    seen.add(id);
    result.push(item);
  });

  return result;
}

type GraphLayoutItem = {
  nodeId: string;
  twinClass: TwinClass_DETAILED;
};

export function TwinClassRelationsGraph() {
  const api = useContext(PrivateApiContext);
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const { searchByFilters } = useTwinClassSearch();

  const [heads, setHeads] = useState<TwinClass_DETAILED[]>([]);
  const [childs, setChilds] = useState<TwinClass_DETAILED[]>([]);
  const [forwards, setForwards] = useState<TwinClass_DETAILED[]>([]);
  const [backwards, setBackwards] = useState<TwinClass_DETAILED[]>([]);
  const [centerClass, setCenterClass] = useState<TwinClass_DETAILED | null>(
    null
  );
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const handleNodeHeightChange = useCallback(
    (nodeId: string, height: number) => {
      const normalizedHeight = Math.max(
        Math.round(height),
        ESTIMATED_NODE_HEIGHT
      );

      setNodeHeights((prev) => {
        if (prev[nodeId] === normalizedHeight) return prev;
        return { ...prev, [nodeId]: normalizedHeight };
      });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadGraphData() {
      if (!twinClassId) return;

      setLoading(true);

      try {
        const [headsResponse, childsResponse, linksResponse] =
          await Promise.all([
            searchByFilters({
              pagination: { pageIndex: 0, pageSize: 100 },
              filters: {
                headHierarchyParentsForTwinClassSearch: {
                  idList: [twinClassId],
                  depth: 1,
                },
              },
            }),
            searchByFilters({
              pagination: { pageIndex: 0, pageSize: 200 },
              filters: {
                headHierarchyChildsForTwinClassSearch: {
                  idList: [twinClassId],
                  depth: 1,
                },
              },
            }),
            api.twinClass.getLinks({ twinClassId }),
          ]);

        if (cancelled) return;

        const linksData = linksResponse.data;

        const rawForward = Object.values(linksData?.forwardLinkMap ?? {}).map(
          (link) => hydrateLinkFromMap(link, linksData?.relatedObjects)
        );
        const rawBackward = Object.values(linksData?.backwardLinkMap ?? {}).map(
          (link) => hydrateLinkFromMap(link, linksData?.relatedObjects)
        );

        const initialForwardClasses = rawForward
          .map((link) => link.dstTwinClass)
          .filter((item): item is TwinClass_DETAILED => Boolean(item?.id));

        const initialBackwardClasses = rawBackward
          .map((link) => link.dstTwinClass)
          .filter((item): item is TwinClass_DETAILED => Boolean(item?.id));

        const needDetailsIds = new Set<string>();
        [
          twinClass,
          ...headsResponse.data,
          ...childsResponse.data,
          ...initialForwardClasses,
          ...initialBackwardClasses,
        ].forEach((item) => {
          if (!item?.id) return;
          needDetailsIds.add(item.id);
        });

        const detailsEntries = await Promise.all(
          Array.from(needDetailsIds).map(async (id) => {
            const { data, error } = await api.twinClass.getById({
              id,
              query: {
                lazyRelation: false,
                showTwinClassMode: "DETAILED",
                showTwinClass2TwinClassFieldMode: "DETAILED",
                showTwinClass2StatusMode: "DETAILED",
                showTwinClassFieldCollectionMode: "SHOW",
              },
            });

            if (error || !data?.twinClass) return [id, undefined] as const;

            return [
              id,
              {
                ...data.twinClass,
                fields: data.twinClass.fieldIds?.length
                  ? data.twinClass.fieldIds
                      .map(
                        (fieldId) =>
                          data.relatedObjects?.twinClassFieldMap?.[fieldId]
                      )
                      .filter(Boolean)
                  : [],
                statuses: data.twinClass.statusIds?.length
                  ? data.twinClass.statusIds
                      .map(
                        (statusId) => data.relatedObjects?.statusMap?.[statusId]
                      )
                      .filter(Boolean)
                  : [],
              } as TwinClass_DETAILED,
            ] as const;
          })
        );

        if (cancelled) return;

        const detailsMap = new Map(
          detailsEntries.filter(
            (entry): entry is readonly [string, TwinClass_DETAILED] =>
              Boolean(entry[1])
          )
        );

        const withDetails = (list: TwinClass_DETAILED[]) =>
          list.map((item) => detailsMap.get(item.id) ?? item);

        setCenterClass(detailsMap.get(twinClassId) ?? twinClass ?? null);
        setHeads(withDetails(headsResponse.data));
        setChilds(withDetails(childsResponse.data));
        setForwards(withDetails(initialForwardClasses));
        setBackwards(withDetails(initialBackwardClasses));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load twin class graph");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGraphData();

    return () => {
      cancelled = true;
    };
  }, [api.twinClass, searchByFilters, twinClass, twinClassId]);

  const graph = useMemo(() => {
    if (!centerClass) {
      return { nodes: [] as Node<ClassGraphNodeData>[], edges: [] as Edge[] };
    }

    const nodes: Node<ClassGraphNodeData>[] = [];
    const edges: Edge[] = [];
    const usedIds = new Set<string>();

    const headItems: GraphLayoutItem[] = uniqueById(heads)
      .filter((item) => item.id !== centerClass.id)
      .map((item, index) => ({
        nodeId: `head:${item.id}:${index}`,
        twinClass: item,
      }));

    const childItems: GraphLayoutItem[] = uniqueById(childs)
      .filter((item) => item.id !== centerClass.id)
      .map((item, index) => ({
        nodeId: `child:${item.id}:${index}`,
        twinClass: item,
      }));

    // Keep every forward/backward link occurrence (including duplicates by class),
    // because relations table shows links, not unique classes.
    const backwardItems: GraphLayoutItem[] = backwards
      .filter((item) => Boolean(item.id))
      .map((item, index) => ({
        nodeId: `backward:${item.id}:${index}`,
        twinClass: item,
      }));

    const forwardItems: GraphLayoutItem[] = forwards
      .filter((item) => Boolean(item.id))
      .map((item, index) => ({
        nodeId: `forward:${item.id}:${index}`,
        twinClass: item,
      }));

    const addNode = (
      nodeId: string,
      twinClassData: TwinClass_DETAILED,
      role: GraphRole,
      x: number,
      y: number
    ) => {
      if (!twinClassData?.id || usedIds.has(nodeId)) return;
      usedIds.add(nodeId);

      nodes.push({
        id: nodeId,
        type: "classNode",
        position: { x, y },
        data: {
          twinClass: twinClassData,
          role,
          onHeightChange: handleNodeHeightChange,
        },
        draggable: false,
        selectable: false,
      });
    };

    const getNodeHeight = (nodeId: string) =>
      nodeHeights[nodeId] ?? ESTIMATED_NODE_HEIGHT;

    addNode(centerClass.id, centerClass, "center", 0, 0);

    let headTopYCursor = 0;
    headItems.forEach((item) => {
      const itemHeight = getNodeHeight(item.nodeId);
      const nextY = headTopYCursor - VERTICAL_GAP - itemHeight;
      addNode(item.nodeId, item.twinClass, "head", 0, nextY);
      headTopYCursor = nextY;
    });

    const centerHeight = getNodeHeight(centerClass.id);
    const childY = centerHeight + VERTICAL_GAP + 40;
    const sideBottomLimitY = childY - SIDE_BOTTOM_CLEARANCE_FROM_CHILDREN;

    childItems.forEach((item, index) => {
      const offset = index - (childItems.length - 1) / 2;
      addNode(
        item.nodeId,
        item.twinClass,
        "child",
        offset * CHILD_GAP_X,
        childY
      );
    });

    let backwardYCursor = sideBottomLimitY;
    backwardItems.forEach((item) => {
      const itemHeight = getNodeHeight(item.nodeId);
      const nextY = backwardYCursor - itemHeight;
      addNode(item.nodeId, item.twinClass, "backward", -SIDE_X, nextY);
      backwardYCursor = nextY - SIDE_ROW_GAP;
    });

    let forwardYCursor = sideBottomLimitY;
    forwardItems.forEach((item) => {
      const itemHeight = getNodeHeight(item.nodeId);
      const nextY = forwardYCursor - itemHeight;
      addNode(item.nodeId, item.twinClass, "forward", SIDE_X, nextY);
      forwardYCursor = nextY - SIDE_ROW_GAP;
    });

    headItems.forEach((item, index) => {
      const sourceId =
        index === 0 ? centerClass.id : headItems[index - 1]?.nodeId;
      const targetId = item.nodeId;
      if (!sourceId || !targetId) return;

      edges.push({
        id: `head-${sourceId}-${targetId}-${index}`,
        source: sourceId,
        target: targetId,
        sourceHandle: HANDLE_IDS.sourceTop,
        targetHandle: HANDLE_IDS.targetBottom,
        type: "default",
        style: { strokeWidth: EDGE_STROKE_WIDTH },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: EDGE_ARROW_WIDTH,
          height: EDGE_ARROW_HEIGHT,
        },
        animated: false,
      });
    });

    childItems.forEach((item, index) => {
      if (!item?.nodeId) return;

      edges.push({
        id: `child-${item.nodeId}-${centerClass.id}-${index}`,
        source: item.nodeId,
        target: centerClass.id,
        sourceHandle: HANDLE_IDS.sourceTop,
        targetHandle: HANDLE_IDS.targetBottom,
        type: "default",
        style: { strokeWidth: EDGE_STROKE_WIDTH },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: EDGE_ARROW_WIDTH,
          height: EDGE_ARROW_HEIGHT,
        },
      });
    });

    backwardItems.forEach((item, index) => {
      if (!item?.nodeId) return;

      edges.push({
        id: `backward-${item.nodeId}-${centerClass.id}-${index}`,
        source: item.nodeId,
        target: centerClass.id,
        sourceHandle: HANDLE_IDS.sourceRight,
        targetHandle: HANDLE_IDS.targetLeft,
        type: "default",
        style: { strokeWidth: EDGE_STROKE_WIDTH },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: EDGE_ARROW_WIDTH,
          height: EDGE_ARROW_HEIGHT,
        },
      });
    });

    forwardItems.forEach((item, index) => {
      if (!item?.nodeId) return;

      edges.push({
        id: `forward-${centerClass.id}-${item.nodeId}-${index}`,
        source: centerClass.id,
        target: item.nodeId,
        sourceHandle: HANDLE_IDS.sourceRight,
        targetHandle: HANDLE_IDS.targetLeft,
        type: "default",
        style: { strokeWidth: EDGE_STROKE_WIDTH },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: EDGE_ARROW_WIDTH,
          height: EDGE_ARROW_HEIGHT,
        },
      });
    });

    return { nodes, edges };
  }, [
    backwards,
    centerClass,
    childs,
    forwards,
    handleNodeHeightChange,
    heads,
    nodeHeights,
  ]);

  if (loading) return <LoadingOverlay />;

  if (!centerClass) return null;

  return (
    <div className="relative h-[calc(100vh-240px)] min-h-[680px] w-full rounded-lg border">
      <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 text-sm font-medium text-slate-500">
        Heads
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-sm font-medium text-slate-500">
        Children
      </div>
      <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-sm font-medium text-slate-500">
        Backward
      </div>
      <div className="pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2 text-sm font-medium text-slate-500">
        Forward
      </div>

      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35, minZoom: 0.2, maxZoom: 1.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function ClassGraphNode({ id, data }: NodeProps<ClassGraphFlowNode>) {
  const { twinClass, role } = data;
  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fieldList = twinClass.fields ?? [];
  const statusList = twinClass.statuses ?? [];
  const visibleFieldList = showAllFields
    ? fieldList
    : fieldList.slice(0, FIELD_LIMIT);
  const visibleStatusList = showAllStatuses
    ? statusList
    : statusList.slice(0, STATUS_LIMIT);
  const hiddenFieldCount = Math.max(
    fieldList.length - visibleFieldList.length,
    0
  );
  const hiddenStatusCount = Math.max(
    statusList.length - visibleStatusList.length,
    0
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const reportHeight = () => {
      data.onHeightChange?.(id, element.offsetHeight);
    };

    reportHeight();

    const observer = new ResizeObserver(() => {
      reportHeight();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [data, id, showAllFields, showAllStatuses]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "from-background via-background to-muted/20 pointer-events-none relative w-full max-w-[280px] min-w-0 rounded-2xl border bg-gradient-to-br px-3.5 py-3 shadow-[0_10px_34px_-28px_rgba(15,23,42,0.8)] transition-colors",
        role === "center" &&
          "border-emerald-600 bg-emerald-50/25 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]",
        role === "head" && "border-blue-400/70",
        role === "child" && "border-emerald-400/70",
        role === "backward" && "border-slate-400/70",
        role === "forward" && "border-indigo-400/70"
      )}
      style={{ width: `${NODE_WIDTH}px` }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id={HANDLE_IDS.targetTop}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={HANDLE_IDS.sourceBottom}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        id={HANDLE_IDS.targetLeft}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        id={HANDLE_IDS.sourceRight}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Top}
        id={HANDLE_IDS.sourceTop}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={HANDLE_IDS.targetBottom}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Left}
        id={HANDLE_IDS.sourceLeft}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="target"
        position={Position.Right}
        id={HANDLE_IDS.targetRight}
        isConnectable={false}
        className="!opacity-0"
      />

      <div className="mb-2 flex flex-wrap items-center gap-2 pt-1">
        <span className="text-muted-foreground text-[9px] font-semibold tracking-[0.24em] uppercase">
          Class
        </span>
        <div className="pointer-events-auto">
          <TwinClassResourceLink data={twinClass} withTooltip />
        </div>
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
              <div key={field.id} className="pointer-events-auto">
                <TwinClassFieldResourceLink
                  data={field as TwinClassField_DETAILED}
                  withTooltip
                />
              </div>
            ))}
            {hiddenFieldCount > 0 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllFields(true);
                }}
                className="bg-muted text-muted-foreground hover:text-foreground pointer-events-auto inline-flex h-6 cursor-pointer items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
              >
                +{hiddenFieldCount} more
              </button>
            )}
            {showAllFields && fieldList.length > FIELD_LIMIT && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllFields(false);
                }}
                className="bg-muted text-muted-foreground hover:text-foreground pointer-events-auto inline-flex h-6 cursor-pointer items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
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
              <div key={status.id} className="pointer-events-auto">
                <TwinClassStatusResourceLink data={status} withTooltip />
              </div>
            ))}
            {hiddenStatusCount > 0 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllStatuses(true);
                }}
                className="bg-muted text-muted-foreground hover:text-foreground pointer-events-auto inline-flex h-6 cursor-pointer items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
              >
                +{hiddenStatusCount} more
              </button>
            )}
            {showAllStatuses && statusList.length > STATUS_LIMIT && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllStatuses(false);
                }}
                className="bg-muted text-muted-foreground hover:text-foreground pointer-events-auto inline-flex h-6 cursor-pointer items-center rounded-full px-2 text-[10px] font-semibold transition-colors"
              >
                Hide
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
