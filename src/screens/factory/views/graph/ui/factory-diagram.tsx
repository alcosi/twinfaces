"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  MarkerType,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

import {
  DASHED_STROKE,
  DIAGRAM_STROKE,
  DIAGRAM_STROKE_COLOR,
  DIAGRAM_STROKE_VAR,
  Diagram,
  EDGE_PATH_OPTIONS,
  FactoryCreateTarget,
  FactoryGraphSelection,
  SOLID_EDGE_WIDTH,
  isSameSelection,
} from "../model";
import { DiagramLayout, layoutDiagram } from "./layout";
import { DiagramFlowNode, diagramNodeTypes } from "./nodes";

type Props = {
  diagram: Diagram;
  selection?: FactoryGraphSelection;
  onSelect: (selection: FactoryGraphSelection) => void;
  onCreate: (target: FactoryCreateTarget) => void;
  className?: string;
  emptyMessage?: string;
};

/**
 * Renders one diagram: elk assigns the coordinates, React Flow handles panning,
 * zooming and edge routing. Layout is async, so the canvas shows a loader until
 * the first result arrives and keeps the previous one while re-laying out.
 */
export function FactoryDiagram({
  diagram,
  selection,
  onSelect,
  onCreate,
  className,
  emptyMessage = "Nothing to show yet.",
}: Props) {
  const [layout, setLayout] = useState<DiagramLayout | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<ReactFlowInstance<DiagramFlowNode, Edge> | null>(null);

  useEffect(() => {
    let cancelled = false;

    layoutDiagram(diagram)
      .then((result) => {
        if (!cancelled) setLayout(result);
      })
      .catch((error) => {
        console.error("Failed to lay out the factory diagram:", error);
        if (!cancelled) setLayout({ nodes: [], isEmpty: true });
      });

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  const nodes = useMemo<DiagramFlowNode[]>(
    () =>
      (layout?.nodes ?? []).map((node) => ({
        id: node.id,
        type: "diagramNode" as const,
        position: { x: node.x, y: node.y },
        // Placeholders and chips are click targets, not drag handles — dragging
        // a node would only desynchronise it from the computed layout.
        draggable: false,
        data: {
          ...node,
          isSelected: isSameSelection(node.selection, selection),
          currentSelection: selection,
          onSelect,
          onCreate,
        },
      })),
    [layout, selection, onSelect, onCreate]
  );

  const edges = useMemo<Edge[]>(
    () =>
      diagram.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        pathOptions: EDGE_PATH_OPTIONS,
        // Along the shared trunk the dashed and solid edges lie exactly on top of
        // each other, so the order decides what shows: solid wins, and a dash
        // only appears once its branch peels off towards the placeholder.
        zIndex: edge.dashed ? 0 : 1,
        style: {
          // Dashed edges carry the very stroke the create affordances outline
          // themselves with, so an edge and the dashed node it arrives at read
          // as one line. Solid ones are heavier — see SOLID_EDGE_WIDTH.
          stroke: DIAGRAM_STROKE,
          strokeWidth: edge.dashed ? DASHED_STROKE.width : SOLID_EDGE_WIDTH,
          strokeDasharray: edge.dashed ? DASHED_STROKE.dashArray : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: DIAGRAM_STROKE,
        },
      })),
    [diagram.edges]
  );

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: DiagramFlowNode) => {
      if (node.data.create) return onCreate(node.data.create);
      if (node.data.selection) return onSelect(node.data.selection);
    },
    [onCreate, onSelect]
  );

  // `fitView` only runs on mount, but this canvas is resized whenever the Node
  // view opens or closes and takes half the width. Without re-fitting, the
  // diagram keeps its old zoom and gets clipped.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      flowRef.current?.fitView();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [layout]);

  // LoadingOverlay is absolutely positioned, so it needs its own positioned box
  // — otherwise it escapes the panel and covers the page.
  if (!layout) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <LoadingOverlay />
      </div>
    );
  }

  if (layout.isEmpty) {
    return (
      <div
        className={cn(
          "text-muted-foreground flex h-full items-center justify-center text-sm",
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      // Inherited by the edges and by every node's dashed outline.
      style={{ [DIAGRAM_STROKE_VAR]: DIAGRAM_STROKE_COLOR } as CSSProperties}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={diagramNodeTypes}
        onInit={(instance) => {
          flowRef.current = instance;
        }}
        fitView
        minZoom={0.15}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
        // Required, not optional: React Flow gives a node `pointer-events: none`
        // unless it is selectable, draggable, or the flow has a node handler —
        // without this nothing inside a node can be clicked. It also catches
        // clicks that land on a node's padding rather than on its body.
        onNodeClick={handleNodeClick}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
