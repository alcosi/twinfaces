import type { ElkNode as ElkLayoutNode } from "elkjs/lib/elk-api";
import ELK from "elkjs/lib/elk.bundled.js";

// Imported from the modules themselves rather than through the model barrel:
// layout is pure geometry, and the barrel also carries the node registry, which
// pulls React and every entity icon in with it.
import {
  GRAPH_ROW,
  GROUP_PADDING,
  LAYER_SPACING,
  TRUNK_CORRIDOR,
} from "../model/constants";
import {
  Diagram,
  DiagramEdge,
  DiagramGroup,
  DiagramNode,
} from "../model/types";

const elk = new ELK();

export type PositionedNode = DiagramNode & { x: number; y: number };
export type PositionedGroup = DiagramGroup & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DiagramLayout = {
  nodes: PositionedNode[];
  groups: PositionedGroup[];
  /** Nothing to lay out — used to skip rendering an empty canvas. */
  isEmpty: boolean;
};

const CANVAS_PADDING = 24;

/**
 * Layered top-to-bottom with orthogonal edges — the shape of the design. Shared
 * by both passes so a group's insides and the groups themselves line up the same
 * way.
 */
const BASE_LAYOUT_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.spacing.nodeNode": "32",
  "elk.layered.spacing.nodeNodeBetweenLayers": `${LAYER_SPACING}`,
  "elk.spacing.edgeNode": "24",
  // Keeps each row in the order the builder emitted it, which puts the dashed
  // create placeholders at the outer ends. Left to reorder freely, elk drops
  // them between the real cards, and their dashed run along the shared trunk
  // then cuts through the solid one.
  "elk.layered.crossingMinimization.strategy": "NONE",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.layered.nodePlacement.favorStraightEdges": "true",
  // Placeholders and rejoining columns would otherwise be scattered into
  // separate components and drift away from the flow they belong to.
  "elk.separateConnectedComponents": "false",
} as const;

/**
 * Lays the canvas out in two passes, rather than handing elk one compound graph.
 *
 * The inner pass places one factory's own cards and measures the box they need;
 * the outer pass places those boxes by the hand-over links between them. Two
 * passes because the rows inside a group are a fact about the model, not
 * something the edges imply — a multiplier and a pipeline both hang off the
 * factory card, so a single layered run would put them side by side instead of
 * in the two rows the design has. Partitioning fixes that, and it is only
 * dependable on a flat graph.
 */
export async function layoutDiagram(diagram: Diagram): Promise<DiagramLayout> {
  if (diagram.nodes.length === 0) {
    return { nodes: [], groups: [], isEmpty: true };
  }

  const nodesByGroup = new Map<string, DiagramNode[]>();
  diagram.nodes.forEach((node) => {
    const groupId = node.groupId ?? "";
    nodesByGroup.set(groupId, [...(nodesByGroup.get(groupId) ?? []), node]);
  });

  const groupIdByNodeId = new Map(
    diagram.nodes.map((node) => [node.id, node.groupId ?? ""] as const)
  );

  const isInternal = (edge: DiagramEdge) =>
    groupIdByNodeId.get(edge.source) === groupIdByNodeId.get(edge.target);

  const innerLayouts = await Promise.all(
    [...nodesByGroup.entries()].map(async ([groupId, nodes]) => {
      const edges = diagram.edges.filter(
        (edge) =>
          isInternal(edge) && groupIdByNodeId.get(edge.source) === groupId
      );

      return [groupId, await layoutGroupContent(nodes, edges)] as const;
    })
  );

  const contentByGroup = new Map(innerLayouts);

  const groupSizes = diagram.groups.map((group) => {
    const content = contentByGroup.get(group.id);

    return {
      ...group,
      width: (content?.width ?? 0) + GROUP_PADDING.left + GROUP_PADDING.right,
      height: (content?.height ?? 0) + GROUP_PADDING.top + GROUP_PADDING.bottom,
    };
  });

  const groupPositions = await layoutGroups(
    groupSizes,
    diagram,
    groupIdByNodeId
  );

  const groups: PositionedGroup[] = groupSizes.map((group) => ({
    ...group,
    x: (groupPositions.get(group.id)?.x ?? 0) + CANVAS_PADDING,
    y: (groupPositions.get(group.id)?.y ?? 0) + CANVAS_PADDING,
  }));

  const groupById = new Map(groups.map((group) => [group.id, group] as const));

  const nodes: PositionedNode[] = diagram.nodes.map((node) => {
    const groupId = node.groupId ?? "";
    const group = groupById.get(groupId);
    const offset = contentByGroup.get(groupId)?.positions.get(node.id);

    return {
      ...node,
      x: (group?.x ?? CANVAS_PADDING) + GROUP_PADDING.left + (offset?.x ?? 0),
      y: (group?.y ?? CANVAS_PADDING) + GROUP_PADDING.top + (offset?.y ?? 0),
    };
  });

  return { nodes, groups, isEmpty: false };
}

type GroupContent = {
  width: number;
  height: number;
  /** Node positions relative to the group's content box. */
  positions: Map<string, { x: number; y: number }>;
};

/**
 * Places one factory's cards. Rows come from each node's `partition` — the
 * factory card, then its multipliers, then its pipelines and branches, then the
 * hand-over placeholders — so a row holds together regardless of which edges
 * happen to exist.
 */
async function layoutGroupContent(
  nodes: DiagramNode[],
  edges: DiagramEdge[]
): Promise<GroupContent> {
  const graph: ElkLayoutNode = {
    id: "group",
    layoutOptions: {
      ...BASE_LAYOUT_OPTIONS,
      "elk.partitioning.activate": "true",
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width,
      height: node.height,
      layoutOptions: { "elk.partitioning.partition": `${node.partition}` },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);
  const positions = new Map<string, { x: number; y: number }>();

  (layout.children ?? []).forEach((child) => {
    positions.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
  });

  alignRowsToTop(nodes, positions);

  const centreX = measure(nodes, positions).width / 2;
  centerRows(nodes, positions, centreX);
  openTrunkCorridor(nodes, positions, centreX);

  // Measured from the cards themselves rather than taken from elk: centring and
  // the corridor both move cards, and the corridor can push them past the box
  // elk reported. The group has to wrap where they actually ended up.
  return normalise(nodes, positions);
}

function measure(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>
) {
  const boxes = nodes.map((node) => {
    const { x, y } = positions.get(node.id) ?? { x: 0, y: 0 };
    return { left: x, top: y, right: x + node.width, bottom: y + node.height };
  });

  const left = Math.min(...boxes.map((box) => box.left), 0);
  const top = Math.min(...boxes.map((box) => box.top), 0);

  return {
    left,
    top,
    width: Math.max(...boxes.map((box) => box.right), 0) - left,
    height: Math.max(...boxes.map((box) => box.bottom), 0) - top,
  };
}

/** Moves the content so it starts at the group's own origin. */
function normalise(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>
): GroupContent {
  const { left, top, width, height } = measure(nodes, positions);

  nodes.forEach((node) => {
    const position = positions.get(node.id);
    if (!position) return;

    positions.set(node.id, { x: position.x - left, y: position.y - top });
  });

  return { width, height, positions };
}

/**
 * Centres every row on the group's centre line.
 *
 * elk packs each layer from the left, so a factory card ends up over whichever
 * child it shares an edge with rather than over the row beneath it, and the
 * connector fans out from the card's corner instead of from the middle of the
 * tree. Centring each row restores the symmetry the design has.
 */
function centerRows(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>,
  centreX: number
) {
  rowsOf(nodes).forEach((rowNodes) => {
    const { left, right } = spanOf(rowNodes, positions);
    const shift = centreX - (left + right) / 2;
    if (Math.abs(shift) < 1) return;

    shiftAll(rowNodes, positions, () => shift);
  });
}

/**
 * Opens a gap down the middle of the multiplier row.
 *
 * A factory's edges to its pipelines run as one trunk from the card's centre
 * down to just above the pipeline row, which means straight through the row of
 * multipliers on the way. Centring that row put a card right under the trunk;
 * pushing whatever sits in the way aside gives the line the corridor the design
 * draws it in — the multipliers to one side of it, the create affordance to the
 * other.
 *
 * Only this row needs it: the rows above and below the trunk are where it starts
 * and ends, not something it passes over.
 */
function openTrunkCorridor(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>,
  centreX: number
) {
  const rowNodes = nodes.filter(
    (node) => node.partition === GRAPH_ROW.multipliers
  );
  if (rowNodes.length === 0) return;

  const half = TRUNK_CORRIDOR / 2;
  const isLeftOfTrunk = (node: DiagramNode) =>
    (positions.get(node.id)?.x ?? 0) + node.width / 2 <= centreX;

  let leftShift = 0;
  let rightShift = 0;

  rowNodes.forEach((node) => {
    const left = positions.get(node.id)?.x ?? 0;
    const right = left + node.width;
    // Already clear of the corridor.
    if (right <= centreX - half || left >= centreX + half) return;

    if (isLeftOfTrunk(node)) {
      leftShift = Math.max(leftShift, right - (centreX - half));
    } else {
      rightShift = Math.max(rightShift, centreX + half - left);
    }
  });

  if (leftShift === 0 && rightShift === 0) return;

  shiftAll(rowNodes, positions, (node) =>
    isLeftOfTrunk(node) ? -leftShift : rightShift
  );
}

function rowsOf(nodes: DiagramNode[]): DiagramNode[][] {
  const rows = new Map<number, DiagramNode[]>();
  nodes.forEach((node) =>
    rows.set(node.partition, [...(rows.get(node.partition) ?? []), node])
  );

  return [...rows.values()];
}

function spanOf(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>
) {
  return {
    left: Math.min(...nodes.map((node) => positions.get(node.id)?.x ?? 0)),
    right: Math.max(
      ...nodes.map((node) => (positions.get(node.id)?.x ?? 0) + node.width)
    ),
  };
}

/** Moves a set of cards sideways, each by however much the caller says. */
function shiftAll(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>,
  by: (node: DiagramNode) => number
) {
  // Read every offset before writing any: the decision of which side of the
  // trunk a card is on must not depend on cards already moved.
  const shifts = nodes.map((node) => [node, by(node)] as const);

  shifts.forEach(([node, shift]) => {
    const position = positions.get(node.id);
    if (!position) return;

    positions.set(node.id, { x: position.x + shift, y: position.y });
  });
}

/**
 * Pulls every card of a row up to that row's top edge.
 *
 * elk centres the nodes of a layer against each other, which is invisible while
 * they are the same height and obvious the moment they are not: in advanced mode
 * a pipeline carrying six steps sits beside one carrying a single step, and
 * centred they share no edge at all. The tallest card already defines the top of
 * the row, so aligning to it only ever moves cards up, within the band elk
 * reserved.
 */
function alignRowsToTop(
  nodes: DiagramNode[],
  positions: Map<string, { x: number; y: number }>
) {
  const rowTops = new Map<number, number>();

  nodes.forEach((node) => {
    const y = positions.get(node.id)?.y;
    if (y === undefined) return;

    const current = rowTops.get(node.partition);
    if (current === undefined || y < current) rowTops.set(node.partition, y);
  });

  nodes.forEach((node) => {
    const position = positions.get(node.id);
    const top = rowTops.get(node.partition);
    if (!position || top === undefined) return;

    positions.set(node.id, { x: position.x, y: top });
  });
}

/**
 * Places the group boxes by the hand-over links between them: an edge from a
 * pipeline in one group to the factory card of another becomes an edge between
 * the two boxes.
 */
async function layoutGroups(
  groups: (DiagramGroup & { width: number; height: number })[],
  diagram: Diagram,
  groupIdByNodeId: Map<string, string>
): Promise<Map<string, { x: number; y: number }>> {
  const seen = new Set<string>();
  const edges = diagram.edges.reduce<
    { id: string; sources: string[]; targets: string[] }[]
  >((acc, edge) => {
    const source = groupIdByNodeId.get(edge.source);
    const target = groupIdByNodeId.get(edge.target);
    if (!source || !target || source === target) return acc;

    const id = `${source}->${target}`;
    if (seen.has(id)) return acc;
    seen.add(id);

    acc.push({ id, sources: [source], targets: [target] });
    return acc;
  }, []);

  const layout = await elk.layout({
    id: "root",
    layoutOptions: {
      ...BASE_LAYOUT_OPTIONS,
      // Groups are boxes of very different sizes; letting elk minimise crossings
      // here keeps the hand-over lines readable, and there are no placeholders
      // at this level whose order has to be preserved.
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.spacing.nodeNode": "56",
    },
    children: groups.map(({ id, width, height }) => ({ id, width, height })),
    edges,
  });

  return new Map(
    (layout.children ?? []).map(
      (child) => [child.id, { x: child.x ?? 0, y: child.y ?? 0 }] as const
    )
  );
}
