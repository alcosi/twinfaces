import type { ElkNode as ElkLayoutNode } from "elkjs/lib/elk-api";
import ELK from "elkjs/lib/elk.bundled.js";

import { Diagram, DiagramNode, LAYER_SPACING } from "../model";

const elk = new ELK();

export type PositionedNode = DiagramNode & { x: number; y: number };

export type DiagramLayout = {
  nodes: PositionedNode[];
  /** Nothing to lay out — used to skip rendering an empty canvas. */
  isEmpty: boolean;
};

const CANVAS_PADDING = 24;

/**
 * Runs the diagram through elk's layered algorithm, top to bottom with
 * orthogonal edges — the shape of the reference block diagrams. Node footprints
 * come from the diagram itself, so the result matches what is rendered.
 */
export async function layoutDiagram(diagram: Diagram): Promise<DiagramLayout> {
  if (diagram.nodes.length === 0) return { nodes: [], isEmpty: true };

  const graph: ElkLayoutNode = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.nodeNode": "48",
      "elk.layered.spacing.nodeNodeBetweenLayers": `${LAYER_SPACING}`,
      "elk.spacing.edgeNode": "28",
      // Keeps each layer in the order the builder emitted it, which puts the
      // dashed create placeholders at the outer ends of a row. Left to reorder
      // freely, elk drops them between the real nodes, and their dashed run
      // along the shared trunk then cuts through the solid one.
      "elk.layered.crossingMinimization.strategy": "NONE",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.favorStraightEdges": "true",
      // Placeholders and rejoining columns would otherwise be scattered into
      // separate components and drift away from the flow they belong to.
      "elk.separateConnectedComponents": "false",
    },
    children: diagram.nodes.map((node) => ({
      id: node.id,
      width: node.width,
      height: node.height,
    })),
    edges: diagram.edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);
  const positionById = new Map(
    (layout.children ?? []).map((child) => [child.id, child] as const)
  );

  return {
    nodes: diagram.nodes.map((node) => {
      const position = positionById.get(node.id);

      return {
        ...node,
        x: (position?.x ?? 0) + CANVAS_PADDING,
        y: (position?.y ?? 0) + CANVAS_PADDING,
      };
    }),
    isEmpty: false,
  };
}
