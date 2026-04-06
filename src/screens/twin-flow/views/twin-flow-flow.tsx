"use client";

import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  type EdgeMouseHandler,
  type EdgeProps,
  type Edge as FlowEdge,
  type Node as FlowNode,
  Handle,
  MarkerType,
  MiniMap,
  type NodeProps,
  Position,
  ReactFlow,
  type ReactFlowInstance,
  getSmoothStepPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type {
  ElkEdgeSection,
  ElkExtendedEdge,
  ElkNode as ElkLayoutNode,
  ElkPoint,
} from "elkjs/lib/elk-api";
import ELK from "elkjs/lib/elk.bundled.js";
import { ArrowRight, CircleDot, GitBranch, MoveDiagonal2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { TwinFlow_DETAILED } from "@/entities/twin-flow";
import {
  TwinFlowTransition_DETAILED,
  useTwinFlowTransitionSearchV1,
} from "@/entities/twin-flow-transition";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { cn, isPopulatedString } from "@/shared/libs";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";

const elk = new ELK();

const NODE_WIDTH = 280;
const NODE_HEIGHT = 124;
const START_NODE_WIDTH = 144;
const START_NODE_HEIGHT = 52;
const COLUMN_GAP = 320;
const ROW_GAP = 220;
const CANVAS_PADDING_X = 96;
const CANVAS_PADDING_Y = 96;
const EDGE_COLOR = "#475569";
const EDGE_ACTIVE_COLOR = "#2563eb";
const START_EDGE_COLOR = "#64748b";
const EDGE_BORDER_RADIUS = 18;
const PORT_SIZE = 12;
const NODE_CONTENT_WIDTH = NODE_WIDTH - 40;
const SELF_TRANSITION_SECTION_HEIGHT = 60;
const SELF_TRANSITION_CHIP_HEIGHT = 26;
const SELF_TRANSITION_ROW_GAP = 6;

type LayoutDirection = "horizontal" | "vertical";
type LabelVisibilityMode = "all" | "selection" | "hidden";
type FlowStatus = NonNullable<TwinFlowTransition_DETAILED["srcTwinStatus"]>;

type GraphNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: FlowStatus;
  incomingCount: number;
  outgoingCount: number;
  selfTransitions: TwinFlowTransition_DETAILED[];
};

type GraphEdgeSection = {
  startPoint: ElkPoint;
  bendPoints: ElkPoint[];
  endPoint: ElkPoint;
};

type GraphEdge = {
  id: string;
  transition: TwinFlowTransition_DETAILED;
  srcNode: GraphNode;
  dstNode: GraphNode;
  sections: GraphEdgeSection[];
};

type GraphModel = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

type StatusFlowNodeData = {
  node: GraphNode;
  layoutDirection: LayoutDirection;
  isDimmed: boolean;
  isInitial: boolean;
  isActive: boolean;
  isRelatedToActiveEdge: boolean;
  isRelatedToSelectedNode: boolean;
  incomingSelected: boolean;
  outgoingSelected: boolean;
  onToggleDirection: (
    nodeId: string,
    direction: "incoming" | "outgoing"
  ) => void;
};

type StartFlowNodeData = {
  label: string;
  layoutDirection: LayoutDirection;
};

type StatusFlowNode = FlowNode<StatusFlowNodeData, "status">;
type StartFlowNode = FlowNode<StartFlowNodeData, "start">;
type AppFlowNode = StatusFlowNode | StartFlowNode;

type TransitionFlowEdgeData = {
  edge: GraphEdge;
  isLabelVisible: boolean;
  isEmphasized: boolean;
  isActive: boolean;
  isNodeRelatedActive: boolean;
  isDimmed: boolean;
  labelCluster: {
    index: number;
    size: number;
    items: GraphEdge[];
    x: number;
    y: number;
  };
};

type StartFlowEdgeData = {
  isStart: true;
};

type TransitionFlowEdge = FlowEdge<TransitionFlowEdgeData, "transition">;
type StartFlowEdge = FlowEdge<StartFlowEdgeData, "start">;
type AppFlowEdge = TransitionFlowEdge | StartFlowEdge;

const nodeTypes = {
  start: StartNode,
  status: StatusNode,
};

const edgeTypes = {
  start: StartEdge,
  transition: TransitionEdge,
};

export function TwinFlowFlow({ twinFlow }: { twinFlow: TwinFlow_DETAILED }) {
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();
  const [transitions, setTransitions] = useState<TwinFlowTransition_DETAILED[]>(
    []
  );
  const [loadingTransitions, setLoadingTransitions] = useState(true);
  const [loadingLayout, setLoadingLayout] = useState(true);
  const [graph, setGraph] = useState<GraphModel>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedDirections, setSelectedDirections] = useState<{
    incoming: boolean;
    outgoing: boolean;
  }>({
    incoming: true,
    outgoing: true,
  });
  const [layoutDirection, setLayoutDirection] =
    useState<LayoutDirection>("horizontal");
  const [labelVisibilityMode, setLabelVisibilityMode] =
    useState<LabelVisibilityMode>("selection");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusModeEnabled, setFocusModeEnabled] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    AppFlowNode,
    AppFlowEdge
  > | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTransitions() {
      setLoadingTransitions(true);

      try {
        const response = await searchTwinFlowTransitions({
          pagination: { pageIndex: 0, pageSize: 1000 },
          filters: { twinflowIdList: [twinFlow.id] },
        });

        if (active) {
          setTransitions(response.data);
        }
      } catch {
        if (active) {
          toast.error("Failed to fetch twinflow transitions");
          setTransitions([]);
        }
      } finally {
        if (active) {
          setLoadingTransitions(false);
        }
      }
    }

    loadTransitions();

    return () => {
      active = false;
    };
  }, [searchTwinFlowTransitions, twinFlow.id]);

  useEffect(() => {
    let active = true;

    async function layoutGraph() {
      setLoadingLayout(true);

      try {
        const nextGraph = await buildGraphModel(
          twinFlow,
          transitions,
          layoutDirection
        );

        if (active) {
          setGraph(nextGraph);
        }
      } catch {
        if (active) {
          toast.error("Failed to build graph layout");
          setGraph({ nodes: [], edges: [] });
        }
      } finally {
        if (active) {
          setLoadingLayout(false);
        }
      }
    }

    layoutGraph();

    return () => {
      active = false;
    };
  }, [layoutDirection, transitions, twinFlow]);

  useEffect(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedDirections({ incoming: true, outgoing: true });
  }, [twinFlow.id]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const matchingNodeIds = useMemo(
    () =>
      new Set(
        graph.nodes
          .filter((node) =>
            matchesStatusSearch(node.status, normalizedSearchQuery)
          )
          .map((node) => node.id)
      ),
    [graph.nodes, normalizedSearchQuery]
  );

  const flowNodes = useMemo<AppFlowNode[]>(() => {
    const initialNode = twinFlow.initialStatusId
      ? graph.nodes.find((node) => node.id === twinFlow.initialStatusId)
      : undefined;

    const activeEdge = selectedEdgeId
      ? graph.edges.find((edge) => edge.id === selectedEdgeId)
      : undefined;
    const relatedNodeIds = selectedNodeId
      ? new Set(
          graph.edges.flatMap((edge) =>
            isEdgeVisibleForSelectedNode(
              edge,
              selectedNodeId,
              selectedDirections
            )
              ? [edge.srcNode.id, edge.dstNode.id]
              : []
          )
        )
      : new Set<string>();
    const hasSelection = selectedNodeId !== null || selectedEdgeId !== null;

    const nodes: AppFlowNode[] = graph.nodes.map((node) => ({
      id: node.id,
      type: "status",
      position: { x: node.x, y: node.y },
      draggable: false,
      selectable: true,
      sourcePosition:
        layoutDirection === "horizontal" ? Position.Right : Position.Bottom,
      targetPosition:
        layoutDirection === "horizontal" ? Position.Left : Position.Top,
      data: {
        node,
        layoutDirection,
        isDimmed:
          (focusModeEnabled &&
            hasSelection &&
            !(
              selectedNodeId === node.id ||
              relatedNodeIds.has(node.id) ||
              activeEdge?.srcNode.id === node.id ||
              activeEdge?.dstNode.id === node.id
            )) ||
          (Boolean(normalizedSearchQuery) && !matchingNodeIds.has(node.id)),
        isInitial: node.id === twinFlow.initialStatusId,
        isActive: selectedNodeId === node.id,
        isRelatedToActiveEdge:
          activeEdge?.srcNode.id === node.id ||
          activeEdge?.dstNode.id === node.id,
        isRelatedToSelectedNode: relatedNodeIds.has(node.id),
        incomingSelected:
          selectedNodeId === node.id && selectedDirections.incoming,
        outgoingSelected:
          selectedNodeId === node.id && selectedDirections.outgoing,
        onToggleDirection: handleToggleDirection,
      },
    }));

    if (initialNode) {
      nodes.unshift({
        id: "start",
        type: "start",
        position: {
          x:
            layoutDirection === "horizontal"
              ? Math.max(initialNode.x - COLUMN_GAP + 16, 0)
              : initialNode.x + initialNode.width / 2 - START_NODE_WIDTH / 2,
          y:
            layoutDirection === "horizontal"
              ? initialNode.y + initialNode.height / 2 - START_NODE_HEIGHT / 2
              : Math.max(initialNode.y - ROW_GAP + 24, 0),
        },
        draggable: false,
        selectable: false,
        sourcePosition:
          layoutDirection === "horizontal" ? Position.Right : Position.Bottom,
        data: { label: "Start", layoutDirection },
      });
    }

    return nodes;
  }, [
    focusModeEnabled,
    graph.edges,
    graph.nodes,
    layoutDirection,
    matchingNodeIds,
    normalizedSearchQuery,
    selectedEdgeId,
    selectedDirections,
    selectedNodeId,
    twinFlow.initialStatusId,
  ]);

  const flowEdges = useMemo<AppFlowEdge[]>(() => {
    const hasSelection = selectedNodeId !== null || selectedEdgeId !== null;
    const edgePresentation = graph.edges.map((edge) => {
      const isLabelVisible =
        labelVisibilityMode === "all"
          ? true
          : labelVisibilityMode === "hidden"
            ? false
            : selectedEdgeId === edge.id ||
              isEdgeVisibleForSelectedNode(
                edge,
                selectedNodeId,
                selectedDirections
              );

      return {
        edge,
        isLabelVisible,
        isActive: selectedEdgeId === edge.id,
        isNodeRelatedActive: isEdgeVisibleForSelectedNode(
          edge,
          selectedNodeId,
          selectedDirections
        ),
        isDimmed:
          (focusModeEnabled &&
            hasSelection &&
            !(
              selectedEdgeId === edge.id ||
              isEdgeVisibleForSelectedNode(
                edge,
                selectedNodeId,
                selectedDirections
              )
            )) ||
          (Boolean(normalizedSearchQuery) &&
            !(
              matchingNodeIds.has(edge.srcNode.id) ||
              matchingNodeIds.has(edge.dstNode.id)
            )),
        isEmphasized:
          selectedEdgeId === null ||
          selectedEdgeId === edge.id ||
          selectedNodeId === null ||
          isEdgeVisibleForSelectedNode(
            edge,
            selectedNodeId,
            selectedDirections
          ),
      };
    });

    const labelClusters = buildLabelClusters(
      edgePresentation
        .filter((item) => item.isLabelVisible)
        .map((item) => item.edge)
    );

    const edges: AppFlowEdge[] = edgePresentation.map((item) => ({
      id: item.edge.id,
      source: item.edge.srcNode.id,
      target: item.edge.dstNode.id,
      type: "transition",
      selectable: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: EDGE_COLOR,
        width: 18,
        height: 18,
      },
      data: {
        edge: item.edge,
        isLabelVisible: item.isLabelVisible,
        isActive: item.isActive,
        isNodeRelatedActive: item.isNodeRelatedActive,
        isDimmed: item.isDimmed,
        isEmphasized: item.isEmphasized,
        labelCluster: labelClusters.get(item.edge.id) ?? {
          index: 0,
          size: 1,
          items: [item.edge],
          ...getLabelPosition(getEdgePathPoints(item.edge)),
        },
      },
    }));

    if (
      twinFlow.initialStatusId &&
      graph.nodes.some((node) => node.id === twinFlow.initialStatusId)
    ) {
      edges.unshift({
        id: "start-edge",
        source: "start",
        target: twinFlow.initialStatusId,
        type: "start",
        selectable: false,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: START_EDGE_COLOR,
          width: 16,
          height: 16,
        },
        data: { isStart: true },
      });
    }

    return edges;
  }, [
    focusModeEnabled,
    graph.edges,
    graph.nodes,
    labelVisibilityMode,
    matchingNodeIds,
    normalizedSearchQuery,
    selectedEdgeId,
    selectedDirections,
    selectedNodeId,
    twinFlow.initialStatusId,
  ]);

  const flowKey = useMemo(
    () =>
      `${twinFlow.id}-${flowNodes
        .map(
          (node) =>
            `${node.id}:${Math.round(node.position.x)}:${Math.round(node.position.y)}`
        )
        .join("|")}-${flowEdges.map((edge) => edge.id).join("|")}`,
    [flowEdges, flowNodes, twinFlow.id]
  );

  useEffect(() => {
    if (!reactFlowInstance?.viewportInitialized) return;

    let targetNodes: AppFlowNode[] = [];

    if (selectedEdgeId) {
      const selectedEdge = graph.edges.find(
        (edge) => edge.id === selectedEdgeId
      );

      if (selectedEdge) {
        targetNodes = flowNodes.filter(
          (node) =>
            node.type === "status" &&
            (node.id === selectedEdge.srcNode.id ||
              node.id === selectedEdge.dstNode.id)
        );
      }
    } else if (selectedNodeId) {
      const relatedIds = new Set(
        graph.edges.flatMap((edge) =>
          isEdgeVisibleForSelectedNode(edge, selectedNodeId, selectedDirections)
            ? [edge.srcNode.id, edge.dstNode.id]
            : []
        )
      );
      relatedIds.add(selectedNodeId);
      targetNodes = flowNodes.filter(
        (node) => node.type === "status" && relatedIds.has(node.id)
      );
    } else if (normalizedSearchQuery && matchingNodeIds.size > 0) {
      targetNodes = flowNodes.filter(
        (node) => node.type === "status" && matchingNodeIds.has(node.id)
      );
    }

    if (targetNodes.length === 0) return;

    void reactFlowInstance.fitView({
      nodes: targetNodes,
      duration: 450,
      padding: 0.28,
      maxZoom: 1.2,
    });
  }, [
    flowNodes,
    graph.edges,
    matchingNodeIds,
    normalizedSearchQuery,
    reactFlowInstance,
    selectedDirections,
    selectedEdgeId,
    selectedNodeId,
  ]);

  const handleNodeClick = (_event: React.MouseEvent, node: AppFlowNode) => {
    if (node.type !== "status") return;

    setSelectedNodeId((current) => {
      const nextId = current === node.id ? null : node.id;

      setSelectedDirections({ incoming: true, outgoing: true });

      return nextId;
    });
    setSelectedEdgeId(null);
  };

  const handleEdgeClick: EdgeMouseHandler<AppFlowEdge> = (_event, edge) => {
    setSelectedEdgeId((current) => (current === edge.id ? null : edge.id));
    setSelectedNodeId(null);
  };

  const handlePaneClick = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedDirections({ incoming: true, outgoing: true });
  };

  function handleToggleDirection(
    nodeId: string,
    direction: "incoming" | "outgoing"
  ) {
    setSelectedEdgeId(null);
    setSelectedNodeId(nodeId);
    setSelectedDirections((current) => {
      const next = { ...current };

      if (direction === "incoming") {
        if (current.incoming && current.outgoing) {
          next.incoming = false;
          next.outgoing = true;
        } else if (!current.incoming && current.outgoing) {
          next.incoming = true;
          next.outgoing = true;
        } else {
          next.incoming = true;
          next.outgoing = false;
        }
      } else {
        if (current.incoming && current.outgoing) {
          next.incoming = true;
          next.outgoing = false;
        } else if (current.incoming && !current.outgoing) {
          next.incoming = true;
          next.outgoing = true;
        } else {
          next.incoming = false;
          next.outgoing = true;
        }
      }

      return next;
    });
  }

  const isLoading = loadingTransitions || loadingLayout;

  return (
    <div className="mx-auto mb-10 flex max-w-full flex-col gap-4 p-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl">Flow</CardTitle>
            <p className="text-muted-foreground max-w-3xl text-sm">
              Interactive graph of statuses and transitions for the current
              twinflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{graph.nodes.length} statuses</Badge>
            <Badge variant="outline">{transitions.length} transitions</Badge>
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search status..."
              fieldSize="sm"
              className="h-8 w-48"
            />
            <div className="bg-muted flex items-center gap-1 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  labelVisibilityMode === "all" &&
                    "bg-background text-foreground shadow-sm"
                )}
                onClick={() => {
                  setLabelVisibilityMode("all");
                }}
              >
                All labels
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  labelVisibilityMode === "selection" &&
                    "bg-background text-foreground shadow-sm"
                )}
                onClick={() => {
                  setLabelVisibilityMode("selection");
                }}
              >
                On selection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  labelVisibilityMode === "hidden" &&
                    "bg-background text-foreground shadow-sm"
                )}
                onClick={() => {
                  setLabelVisibilityMode("hidden");
                }}
              >
                Hidden
              </Button>
            </div>
            <Button
              variant={focusModeEnabled ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => {
                setFocusModeEnabled((current) => !current);
              }}
            >
              Focus mode
            </Button>
            <div className="bg-muted flex items-center gap-1 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  layoutDirection === "horizontal" &&
                    "bg-background text-foreground shadow-sm"
                )}
                onClick={() => {
                  setLayoutDirection("horizontal");
                }}
              >
                Horizontal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  layoutDirection === "vertical" &&
                    "bg-background text-foreground shadow-sm"
                )}
                onClick={() => {
                  setLayoutDirection("vertical");
                }}
              >
                Vertical
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-muted-foreground flex min-h-80 items-center justify-center rounded-lg border border-dashed">
              Loading flow graph...
            </div>
          ) : graph.nodes.length === 0 ? (
            <div className="text-muted-foreground flex min-h-80 items-center justify-center rounded-lg border border-dashed">
              No statuses or transitions found for this twinflow.
            </div>
          ) : (
            <div className="from-muted/35 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br">
              <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]" />

              <div className="h-[920px] w-full">
                <ReactFlow<AppFlowNode, AppFlowEdge>
                  key={flowKey}
                  nodes={flowNodes}
                  edges={flowEdges}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.18, maxZoom: 1.1 }}
                  minZoom={0.35}
                  maxZoom={1.6}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable
                  panOnDrag
                  zoomOnScroll
                  onNodeClick={handleNodeClick}
                  onEdgeClick={handleEdgeClick}
                  onPaneClick={handlePaneClick}
                  onInit={setReactFlowInstance}
                  proOptions={{ hideAttribution: true }}
                  defaultEdgeOptions={{
                    zIndex: 0,
                  }}
                  className="bg-transparent"
                >
                  <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1.2}
                    color="hsl(var(--border))"
                  />

                  <MiniMap
                    pannable
                    zoomable
                    nodeBorderRadius={18}
                    className="!bg-background/90 !border-border !z-30 !rounded-xl !border !shadow-lg"
                    maskColor="rgba(120, 120, 120, 0.10)"
                    nodeColor={(node) => {
                      if (node.type === "start") {
                        return "hsl(var(--muted-foreground))";
                      }

                      const data = node.data as StatusFlowNodeData;

                      return data.node.status.backgroundColor || "#94a3b8";
                    }}
                  />

                  <Controls
                    showInteractive={false}
                    className="!border-border !bg-background/90 !z-30 !rounded-xl !border !shadow-lg"
                  />
                </ReactFlow>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function buildGraphModel(
  twinFlow: TwinFlow_DETAILED,
  transitions: TwinFlowTransition_DETAILED[],
  layoutDirection: LayoutDirection
): Promise<GraphModel> {
  const statusesMap = new Map<string, FlowStatus>();

  if (twinFlow.initialStatus?.id) {
    statusesMap.set(twinFlow.initialStatus.id, twinFlow.initialStatus);
  }

  transitions.forEach((transition) => {
    if (transition.srcTwinStatus?.id) {
      statusesMap.set(transition.srcTwinStatus.id, transition.srcTwinStatus);
    }

    if (transition.dstTwinStatus?.id) {
      statusesMap.set(transition.dstTwinStatus.id, transition.dstTwinStatus);
    }
  });

  const incomingCounts = new Map<string, number>();
  const outgoingCounts = new Map<string, number>();
  const selfTransitionsByStatus = new Map<
    string,
    TwinFlowTransition_DETAILED[]
  >();

  statusesMap.forEach((_, id) => {
    incomingCounts.set(id, 0);
    outgoingCounts.set(id, 0);
    selfTransitionsByStatus.set(id, []);
  });

  transitions.forEach((transition) => {
    const srcId = transition.srcTwinStatus?.id;
    const dstId = transition.dstTwinStatus?.id;

    if (!srcId || !dstId) return;

    if (srcId === dstId) {
      selfTransitionsByStatus.set(srcId, [
        ...(selfTransitionsByStatus.get(srcId) ?? []),
        transition,
      ]);
      return;
    }

    outgoingCounts.set(srcId, (outgoingCounts.get(srcId) ?? 0) + 1);
    incomingCounts.set(dstId, (incomingCounts.get(dstId) ?? 0) + 1);
  });

  const orderedStatuses = [...statusesMap.values()].sort((left, right) => {
    if (left.id === twinFlow.initialStatusId) return -1;
    if (right.id === twinFlow.initialStatusId) return 1;

    return getStatusDisplayName(left).localeCompare(
      getStatusDisplayName(right)
    );
  });

  if (orderedStatuses.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nonSelfTransitions = transitions.filter((transition) => {
    const srcId = transition.srcTwinStatus?.id;
    const dstId = transition.dstTwinStatus?.id;

    return Boolean(srcId && dstId && srcId !== dstId);
  });

  const elkGraph: ElkLayoutNode = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": layoutDirection === "horizontal" ? "RIGHT" : "DOWN",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.nodeNode":
        layoutDirection === "horizontal" ? `${ROW_GAP}` : `${COLUMN_GAP}`,
      "elk.layered.spacing.nodeNodeBetweenLayers":
        layoutDirection === "horizontal" ? `${COLUMN_GAP}` : `${ROW_GAP}`,
      "elk.spacing.edgeNode": "36",
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.favorStraightEdges": "true",
      "elk.layered.unnecessaryBendpoints": "false",
      "elk.separateConnectedComponents": "true",
    },
    children: orderedStatuses.map((status) => {
      const id = status.id!;
      const selfTransitions = selfTransitionsByStatus.get(id) ?? [];

      return {
        id,
        width: NODE_WIDTH,
        height: estimateNodeHeight(selfTransitions),
        layoutOptions: {
          "elk.portConstraints": "FIXED_SIDE",
          ...(id === twinFlow.initialStatusId
            ? { "elk.layered.layering.layerConstraint": "FIRST" }
            : {}),
        },
        ports: [
          {
            id: getPortId(id, "incoming"),
            width: PORT_SIZE,
            height: PORT_SIZE,
            layoutOptions: {
              "elk.port.side":
                layoutDirection === "horizontal" ? "WEST" : "NORTH",
            },
          },
          {
            id: getPortId(id, "outgoing"),
            width: PORT_SIZE,
            height: PORT_SIZE,
            layoutOptions: {
              "elk.port.side":
                layoutDirection === "horizontal" ? "EAST" : "SOUTH",
            },
          },
        ],
      };
    }),
    edges: nonSelfTransitions.map((transition) => ({
      id: transition.id!,
      sources: [getPortId(transition.srcTwinStatus!.id!, "outgoing")],
      targets: [getPortId(transition.dstTwinStatus!.id!, "incoming")],
    })),
  };

  const layout = await elk.layout(elkGraph);
  const layoutNodes = new Map(
    (layout.children ?? []).map((node) => [node.id, node] as const)
  );
  const nodes = orderedStatuses.flatMap((status) => {
    const id = status.id!;
    const layoutNode = layoutNodes.get(id);

    if (!layoutNode) return [];

    return [
      {
        id,
        x:
          (layoutNode.x ?? 0) +
          CANVAS_PADDING_X +
          (layoutDirection === "horizontal" ? START_NODE_WIDTH : 0),
        y: (layoutNode.y ?? 0) + CANVAS_PADDING_Y,
        width: layoutNode.width ?? NODE_WIDTH,
        height:
          layoutNode.height ??
          estimateNodeHeight(selfTransitionsByStatus.get(id) ?? []),
        status,
        incomingCount: incomingCounts.get(id) ?? 0,
        outgoingCount: outgoingCounts.get(id) ?? 0,
        selfTransitions: selfTransitionsByStatus.get(id) ?? [],
      },
    ];
  });

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const transitionsById = new Map(
    nonSelfTransitions.map(
      (transition) => [transition.id!, transition] as const
    )
  );

  const edges = ((layout.edges ?? []) as ElkExtendedEdge[])
    .map((layoutEdge) => {
      const transition = transitionsById.get(layoutEdge.id!);

      if (!transition) return undefined;

      const srcId = transition.srcTwinStatus?.id;
      const dstId = transition.dstTwinStatus?.id;

      if (!srcId || !dstId) return undefined;

      const srcNode = nodesById.get(srcId);
      const dstNode = nodesById.get(dstId);

      if (!srcNode || !dstNode) return undefined;

      return {
        id: transition.id!,
        transition,
        srcNode,
        dstNode,
        sections: (layoutEdge.sections ?? []).map((section) =>
          normalizeEdgeSection(section, layoutDirection)
        ),
      };
    })
    .filter((edge): edge is GraphEdge => Boolean(edge));

  return {
    nodes,
    edges,
  };
}

function StartNode({ data }: NodeProps<StartFlowNode>) {
  return (
    <div className="border-foreground/25 bg-background/92 rounded-full border border-dashed px-4 py-2 shadow-sm backdrop-blur-sm">
      <Handle
        type="source"
        position={
          data.layoutDirection === "horizontal"
            ? Position.Right
            : Position.Bottom
        }
        isConnectable={false}
        className="!border-background !bg-foreground/70 !h-2.5 !w-2.5 !border-2"
      />

      <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase">
        <CircleDot className="h-3.5 w-3.5" />
        {data.label}
      </div>
    </div>
  );
}

function StatusNode({ data, selected }: NodeProps<StatusFlowNode>) {
  const {
    node,
    layoutDirection,
    isDimmed,
    isInitial,
    isActive,
    isRelatedToActiveEdge,
    isRelatedToSelectedNode,
    incomingSelected,
    outgoingSelected,
    onToggleDirection,
  } = data;
  const statusColor = node.status.backgroundColor || "#94a3b8";
  const isHighlighted =
    isActive || isRelatedToActiveEdge || isRelatedToSelectedNode || selected;
  const accentColor = isHighlighted ? EDGE_ACTIVE_COLOR : statusColor;

  return (
    <div
      className={cn(
        "group bg-background/96 relative rounded-[28px] border shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-all",
        isHighlighted && "shadow-[0_24px_48px_-24px_rgba(37,99,235,0.45)]"
      )}
      style={{
        width: `${NODE_WIDTH}px`,
        minHeight: `${node.height}px`,
        opacity: isDimmed ? 0.15 : 1,
        borderColor: isHighlighted ? EDGE_ACTIVE_COLOR : `${statusColor}80`,
        boxShadow: isHighlighted
          ? `0 0 0 2px ${EDGE_ACTIVE_COLOR}, 0 16px 42px -26px ${EDGE_ACTIVE_COLOR}`
          : isInitial
            ? `0 0 0 1px ${statusColor} inset, 0 10px 36px -24px ${statusColor}`
            : undefined,
      }}
    >
      <Handle
        type="target"
        position={
          layoutDirection === "horizontal" ? Position.Left : Position.Top
        }
        isConnectable={false}
        className="!border-background !h-3.5 !w-3.5 !border-2"
        style={{ backgroundColor: accentColor }}
      />
      <Handle
        type="source"
        position={
          layoutDirection === "horizontal" ? Position.Right : Position.Bottom
        }
        isConnectable={false}
        className="!border-background !h-3.5 !w-3.5 !border-2"
        style={{ backgroundColor: accentColor }}
      />

      <div
        className="absolute inset-x-4 top-0 h-1.5 rounded-b-full opacity-90"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {isInitial && (
                <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Initial
                </span>
              )}
              <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.22em] uppercase">
                Status
              </span>
            </div>

            <div className="min-w-0">
              <TwinClassStatusResourceLink
                data={node.status}
                twinClassId={node.status.twinClassId}
                withTooltip
              />
            </div>

            {isPopulatedString(node.status.key) && (
              <div className="text-muted-foreground truncate text-xs">
                Key: {node.status.key}
              </div>
            )}

            {node.selfTransitions.length > 0 && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Self transitions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {node.selfTransitions.map((transition) => (
                    <TwinFlowTransitionResourceLink
                      key={transition.id}
                      data={transition}
                      withTooltip
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <span
            className="ring-background mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 rounded-full ring-4"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto rounded-full px-2 py-1 text-xs",
                incomingSelected
                  ? "bg-[color:var(--accent-color)]/12 text-[color:var(--accent-color)]"
                  : "bg-muted text-muted-foreground"
              )}
              style={
                incomingSelected
                  ? ({
                      "--accent-color": EDGE_ACTIVE_COLOR,
                    } as React.CSSProperties)
                  : undefined
              }
              onClick={(event) => {
                event.stopPropagation();
                onToggleDirection(node.id, "incoming");
              }}
            >
              <MoveDiagonal2 className="mr-1 h-3 w-3" />
              {node.incomingCount} in
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto rounded-full px-2 py-1 text-xs",
                outgoingSelected
                  ? "bg-[color:var(--accent-color)]/12 text-[color:var(--accent-color)]"
                  : "bg-muted text-muted-foreground"
              )}
              style={
                outgoingSelected
                  ? ({
                      "--accent-color": EDGE_ACTIVE_COLOR,
                    } as React.CSSProperties)
                  : undefined
              }
              onClick={(event) => {
                event.stopPropagation();
                onToggleDirection(node.id, "outgoing");
              }}
            >
              <GitBranch className="mr-1 h-3 w-3" />
              {node.outgoingCount} out
            </Button>
          </div>

          <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}

function StartEdge(props: EdgeProps<StartFlowEdge>) {
  const sourceX = props.sourceX;
  const sourceY = props.sourceY;
  const targetX = props.targetX;
  const targetY = props.targetY;
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    borderRadius: EDGE_BORDER_RADIUS,
    offset: 28,
  });

  return (
    <BaseEdge
      id={props.id}
      path={path}
      markerEnd={props.markerEnd}
      interactionWidth={10}
      style={{
        stroke: START_EDGE_COLOR,
        strokeWidth: 2.2,
        strokeDasharray: "7 6",
        strokeLinecap: "round",
      }}
    />
  );
}

function TransitionEdge(props: EdgeProps<TransitionFlowEdge>) {
  const graphEdge = props.data?.edge;

  if (!graphEdge) return null;

  const points = getEdgePathPoints(graphEdge);
  const path = createRoundedPath(points, EDGE_BORDER_RADIUS);
  const labelCluster = props.data?.labelCluster;
  const clusterData = labelCluster ?? {
    index: 0,
    size: 1,
    items: [graphEdge],
    ...getLabelPosition(points),
  };
  const labelX = clusterData.x;
  const labelY = clusterData.y;
  const isClusterRepresentative = clusterData.index === 0;
  const isClustered = clusterData.size > 1;

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        markerEnd={props.markerEnd}
        interactionWidth={10}
        style={{
          opacity: props.data?.isDimmed ? 0.15 : 1,
          stroke:
            props.data?.isActive || props.data?.isNodeRelatedActive
              ? EDGE_ACTIVE_COLOR
              : props.data?.isEmphasized === false
                ? `${EDGE_COLOR}55`
                : EDGE_COLOR,
          strokeWidth:
            props.selected || props.data?.isLabelVisible ? 2.8 : 2.15,
          strokeLinecap: "round",
        }}
      />

      {props.data?.isLabelVisible && isClusterRepresentative && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute z-10"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {isClustered ? (
              <div className="group pointer-events-auto relative">
                <div
                  className="bg-background/95 flex max-w-52 items-center gap-2 rounded-xl border px-2 py-1 shadow-lg backdrop-blur-sm"
                  style={{
                    opacity: props.data?.isDimmed ? 0.15 : 1,
                    borderColor:
                      props.data?.isActive || props.data?.isNodeRelatedActive
                        ? EDGE_ACTIVE_COLOR
                        : undefined,
                    boxShadow:
                      props.data?.isActive || props.data?.isNodeRelatedActive
                        ? `0 0 0 1px ${EDGE_ACTIVE_COLOR}`
                        : undefined,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <TwinFlowTransitionResourceLink
                      data={graphEdge.transition}
                      withTooltip
                    />
                  </div>
                  <span className="text-muted-foreground shrink-0 text-[11px] font-medium">
                    +{clusterData.size - 1}
                  </span>
                </div>

                <div className="absolute top-full left-1/2 z-20 h-3 w-full -translate-x-1/2" />
                <div className="pointer-events-none invisible absolute top-full left-1/2 z-20 w-64 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                  <div
                    className="bg-background/98 pointer-events-auto max-h-56 overflow-auto rounded-xl border p-2 shadow-xl backdrop-blur-sm"
                    style={{
                      borderColor:
                        props.data?.isActive || props.data?.isNodeRelatedActive
                          ? EDGE_ACTIVE_COLOR
                          : undefined,
                      boxShadow:
                        props.data?.isActive || props.data?.isNodeRelatedActive
                          ? `0 0 0 1px ${EDGE_ACTIVE_COLOR}`
                          : undefined,
                    }}
                  >
                    <div className="flex flex-col gap-1.5">
                      {clusterData.items.map((edge) => (
                        <div
                          key={edge.id}
                          className="rounded-lg border px-2 py-1"
                        >
                          <TwinFlowTransitionResourceLink
                            data={edge.transition}
                            withTooltip
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="bg-background/95 pointer-events-auto max-w-44 rounded-xl border px-2 py-1 shadow-lg backdrop-blur-sm"
                style={{
                  opacity: props.data?.isDimmed ? 0.15 : 1,
                  borderColor:
                    props.data?.isActive || props.data?.isNodeRelatedActive
                      ? EDGE_ACTIVE_COLOR
                      : undefined,
                  boxShadow:
                    props.data?.isActive || props.data?.isNodeRelatedActive
                      ? `0 0 0 1px ${EDGE_ACTIVE_COLOR}`
                      : undefined,
                }}
              >
                <TwinFlowTransitionResourceLink
                  data={graphEdge.transition}
                  withTooltip
                />
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function getPortId(nodeId: string, direction: "incoming" | "outgoing") {
  return `${nodeId}__${direction}`;
}

function estimateNodeHeight(selfTransitions: TwinFlowTransition_DETAILED[]) {
  if (selfTransitions.length === 0) {
    return NODE_HEIGHT;
  }

  const rowCount = estimateSelfTransitionRows(selfTransitions);
  const extraRows = Math.max(rowCount - 1, 0);

  return (
    NODE_HEIGHT +
    SELF_TRANSITION_SECTION_HEIGHT +
    extraRows * (SELF_TRANSITION_CHIP_HEIGHT + SELF_TRANSITION_ROW_GAP)
  );
}

function normalizeEdgeSection(
  section: ElkEdgeSection,
  layoutDirection: LayoutDirection
): GraphEdgeSection {
  return {
    startPoint: {
      x:
        section.startPoint.x +
        CANVAS_PADDING_X +
        (layoutDirection === "horizontal" ? START_NODE_WIDTH : 0),
      y: section.startPoint.y + CANVAS_PADDING_Y,
    },
    bendPoints: (section.bendPoints ?? []).map((point) => ({
      x:
        point.x +
        CANVAS_PADDING_X +
        (layoutDirection === "horizontal" ? START_NODE_WIDTH : 0),
      y: point.y + CANVAS_PADDING_Y,
    })),
    endPoint: {
      x:
        section.endPoint.x +
        CANVAS_PADDING_X +
        (layoutDirection === "horizontal" ? START_NODE_WIDTH : 0),
      y: section.endPoint.y + CANVAS_PADDING_Y,
    },
  };
}

function getEdgePathPoints(edge: GraphEdge): Array<[number, number]> {
  const sections = edge.sections;

  if (sections.length === 0) {
    return [
      [
        edge.srcNode.x + edge.srcNode.width,
        edge.srcNode.y + edge.srcNode.height / 2,
      ],
      [edge.dstNode.x, edge.dstNode.y + edge.dstNode.height / 2],
    ];
  }

  const points: Array<[number, number]> = [];

  sections.forEach((section) => {
    const sectionPoints: Array<[number, number]> = [
      [section.startPoint.x, section.startPoint.y],
      ...section.bendPoints.map(
        (point) => [point.x, point.y] as [number, number]
      ),
      [section.endPoint.x, section.endPoint.y],
    ];

    sectionPoints.forEach((point) => {
      const lastPoint = points.at(-1);

      if (
        !lastPoint ||
        lastPoint[0] !== point[0] ||
        lastPoint[1] !== point[1]
      ) {
        points.push(point);
      }
    });
  });

  return points;
}

function getLabelPosition(points: Array<[number, number]>) {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  if (points.length === 1) {
    return { x: points[0]![0], y: points[0]![1] - 18 };
  }

  const segments = points.slice(0, -1).map((point, index) => {
    const nextPoint = points[index + 1]!;
    const length = Math.hypot(nextPoint[0] - point[0], nextPoint[1] - point[1]);

    return {
      start: point,
      end: nextPoint,
      length,
    };
  });

  const totalLength = segments.reduce(
    (sum, segment) => sum + segment.length,
    0
  );

  if (totalLength === 0) {
    return { x: points[0]![0], y: points[0]![1] - 18 };
  }

  let traversed = 0;
  const targetLength = totalLength * 0.45;

  for (const segment of segments) {
    if (traversed + segment.length >= targetLength) {
      const remaining = targetLength - traversed;
      const ratio = segment.length === 0 ? 0 : remaining / segment.length;
      const x = segment.start[0] + (segment.end[0] - segment.start[0]) * ratio;
      const y = segment.start[1] + (segment.end[1] - segment.start[1]) * ratio;

      return { x, y: y - 18 };
    }

    traversed += segment.length;
  }

  const lastPoint = points.at(-1)!;

  return { x: lastPoint[0], y: lastPoint[1] - 18 };
}

function isEdgeVisibleForSelectedNode(
  edge: GraphEdge,
  selectedNodeId: string | null,
  selectedDirections: { incoming: boolean; outgoing: boolean }
) {
  if (!selectedNodeId) return false;

  const isIncoming = edge.dstNode.id === selectedNodeId;
  const isOutgoing = edge.srcNode.id === selectedNodeId;

  return (
    (selectedDirections.incoming && isIncoming) ||
    (selectedDirections.outgoing && isOutgoing)
  );
}

function createRoundedPath(points: Array<[number, number]>, radius: number) {
  if (points.length < 2) return "";

  const firstPoint = points[0]!;
  const secondPoint = points[1]!;

  if (points.length === 2) {
    return `M ${firstPoint[0]} ${firstPoint[1]} L ${secondPoint[0]} ${secondPoint[1]}`;
  }

  const commands: string[] = [`M ${firstPoint[0]} ${firstPoint[1]}`];

  for (let index = 1; index < points.length - 1; index += 1) {
    const [prevX, prevY] = points[index - 1]!;
    const [currX, currY] = points[index]!;
    const [nextX, nextY] = points[index + 1]!;

    const inDx = currX - prevX;
    const inDy = currY - prevY;
    const outDx = nextX - currX;
    const outDy = nextY - currY;

    const inLength = Math.hypot(inDx, inDy);
    const outLength = Math.hypot(outDx, outDy);

    if (inLength === 0 || outLength === 0) {
      commands.push(`L ${currX} ${currY}`);
      continue;
    }

    const cornerRadius = Math.min(radius, inLength / 2, outLength / 2);
    const startX = currX - (inDx / inLength) * cornerRadius;
    const startY = currY - (inDy / inLength) * cornerRadius;
    const endX = currX + (outDx / outLength) * cornerRadius;
    const endY = currY + (outDy / outLength) * cornerRadius;

    commands.push(`L ${startX} ${startY}`);
    commands.push(`Q ${currX} ${currY} ${endX} ${endY}`);
  }

  const [lastX, lastY] = points[points.length - 1]!;
  commands.push(`L ${lastX} ${lastY}`);

  return commands.join(" ");
}

function getStatusDisplayName(status: FlowStatus) {
  return isPopulatedString(status.name) ? status.name : (status.id ?? "Status");
}

function getTransitionDisplayName(transition: TwinFlowTransition_DETAILED) {
  return isPopulatedString(transition.name)
    ? transition.name
    : (transition.id ?? "Transition");
}

function estimateSelfTransitionRows(
  selfTransitions: TwinFlowTransition_DETAILED[]
) {
  let rows = 1;
  let currentRowWidth = 0;

  for (const transition of selfTransitions) {
    const label = getTransitionDisplayName(transition);
    const estimatedChipWidth = Math.min(
      NODE_CONTENT_WIDTH,
      34 + label.length * 7.2
    );

    if (currentRowWidth === 0) {
      currentRowWidth = estimatedChipWidth;
      continue;
    }

    const nextRowWidth = currentRowWidth + 6 + estimatedChipWidth;

    if (nextRowWidth > NODE_CONTENT_WIDTH) {
      rows += 1;
      currentRowWidth = estimatedChipWidth;
      continue;
    }

    currentRowWidth = nextRowWidth;
  }

  return rows;
}

function matchesStatusSearch(status: FlowStatus, query: string) {
  if (!query) return true;

  const haystack = [getStatusDisplayName(status), status.key, status.id]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function buildLabelClusters(edges: GraphEdge[]) {
  const positions = edges.map((edge) => ({
    edge,
    ...getLabelPosition(getEdgePathPoints(edge)),
  }));
  const clusters: Array<typeof positions> = [];

  positions.forEach((position) => {
    const existingCluster = clusters.find((cluster) =>
      cluster.some(
        (item) =>
          Math.abs(item.x - position.x) <= 42 &&
          Math.abs(item.y - position.y) <= 24
      )
    );

    if (existingCluster) {
      existingCluster.push(position);
      return;
    }

    clusters.push([position]);
  });

  const clusterMap = new Map<
    string,
    {
      index: number;
      size: number;
      items: GraphEdge[];
      x: number;
      y: number;
    }
  >();

  clusters.forEach((cluster) => {
    const sortedCluster = [...cluster].sort((left, right) =>
      left.edge.transition.id!.localeCompare(right.edge.transition.id!)
    );
    const x =
      sortedCluster.reduce((sum, item) => sum + item.x, 0) /
      sortedCluster.length;
    const y =
      sortedCluster.reduce((sum, item) => sum + item.y, 0) /
      sortedCluster.length;

    sortedCluster.forEach((item, index) => {
      clusterMap.set(item.edge.id, {
        index,
        size: sortedCluster.length,
        items: sortedCluster.map((clusterItem) => clusterItem.edge),
        x,
        y,
      });
    });
  });

  return clusterMap;
}
