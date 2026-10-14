"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CSSProperties, useEffect, useMemo, useRef } from "react";

import { DIAGRAM_STROKE_COLOR, DIAGRAM_STROKE_VAR } from "@/shared/ui/diagram";

import { ClassGraphLayout, GraphMode, LinkSide } from "../model";
import { ClassFlowNode, classNodeTypes } from "./nodes";

type Props = {
  layout: ClassGraphLayout;
  mode: GraphMode;
  onCreate: (side: LinkSide) => void;
};

/** Breathing room around the wires layer, so a stroke on its edge is not clipped. */
const WIRES_PADDING = 4;

export function ClassDiagram({ layout, mode, onCreate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<ReactFlowInstance<ClassFlowNode> | null>(null);

  const nodes = useMemo<ClassFlowNode[]>(() => {
    const points = layout.wires.flatMap((wire) => wire.points);
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const originX = Math.min(...xs) - WIRES_PADDING;
    const originY = Math.min(...ys) - WIRES_PADDING;

    const wires: ClassFlowNode[] =
      points.length > 0
        ? [
            {
              id: "wires",
              type: "wires",
              position: { x: originX, y: originY },
              zIndex: 0,
              selectable: false,
              // Spans the whole canvas under the cards; it must never take a
              // pan or a click meant for the background.
              style: { pointerEvents: "none" },
              data: {
                wires: layout.wires,
                originX,
                originY,
                width: Math.max(...xs) + WIRES_PADDING - originX,
                height: Math.max(...ys) + WIRES_PADDING - originY,
              },
            },
          ]
        : [];

    const rest = layout.nodes.map<ClassFlowNode>((node) => {
      const base = {
        id: node.id,
        position: { x: node.x, y: node.y },
        selectable: false,
      };

      switch (node.kind) {
        case "class":
          return {
            ...base,
            type: "classCard",
            // Known up front, so fitting the view never waits on a measurement.
            width: node.width,
            height: node.height,
            zIndex: 1,
            data: { ...node, mode },
          };
        case "placeholder":
          return {
            ...base,
            type: "placeholder",
            width: node.width,
            height: node.height,
            zIndex: 1,
            data: { ...node, onCreate },
          };
        case "caption":
          return { ...base, type: "caption", zIndex: 2, data: node };
        case "linkPill":
          return { ...base, type: "linkPill", zIndex: 2, data: node };
      }
    });

    return [...wires, ...rest];
  }, [layout, mode, onCreate]);

  // `fitView` only runs on mount, but the canvas changes size with the tab's
  // own layout, and the diagram changes size with the mode and the labels.
  useEffect(() => {
    const frame = requestAnimationFrame(() => flowRef.current?.fitView());
    return () => cancelAnimationFrame(frame);
  }, [layout]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => flowRef.current?.fitView());
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      // Inherited by the wires and by the dashed outlines.
      style={{ [DIAGRAM_STROKE_VAR]: DIAGRAM_STROKE_COLOR } as CSSProperties}
    >
      <ReactFlow
        nodes={nodes}
        nodeTypes={classNodeTypes}
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
        // without this nothing inside a card can be clicked.
        onNodeClick={() => {}}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
