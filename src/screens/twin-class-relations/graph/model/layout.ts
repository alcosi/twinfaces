import { TwinClass_DETAILED } from "@/entities/twin-class";

import { PLACEHOLDER_SIZE, SPACING, measureCard } from "./constants";
import {
  ClassCardNode,
  ClassGraphData,
  ClassGraphLayout,
  ClassGraphLink,
  ClassGraphNode,
  GraphMode,
  LinkSide,
  Wire,
} from "./types";

type Options = {
  mode: GraphMode;
  showLinkLabels: boolean;
};

/**
 * Places the class and everything around it: heads stacked above, children in
 * a row below, backward links fanning out to the left and forward links to the
 * right. The shape is fixed, so it is laid out by hand rather than by a graph
 * layout engine — every line is a straight orthogonal run between two known
 * points.
 *
 * The centre card sits at the origin; React Flow fits the result to the view.
 */
export function layoutClassGraph(
  data: ClassGraphData,
  { mode, showLinkLabels }: Options
): ClassGraphLayout {
  const branchReach = showLinkLabels
    ? SPACING.branchReach.withLabels
    : SPACING.branchReach.withoutLabels;
  const nodes: ClassGraphNode[] = [];
  const wires: Wire[] = [];

  const cardOf = (
    id: string,
    twinClass: TwinClass_DETAILED,
    x: number,
    y: number,
    isCenter = false
  ): ClassCardNode => ({
    kind: "class",
    id,
    twinClass,
    isCenter,
    x,
    y,
    ...measureCard(twinClass, mode),
  });

  const center = cardOf(`center:${data.center.id}`, data.center, 0, 0, true);
  nodes.push(center);

  const centerX = center.width / 2;
  const centerY = center.height / 2;

  // Heads: each one straight above the previous, the line running up the
  // middle. Only the first gap is captioned — the chain above it is the same
  // relation repeated.
  let headAnchorY = center.y;
  data.heads.forEach((head, index) => {
    const size = measureCard(head, mode);
    const card = cardOf(
      `head:${head.id}:${index}`,
      head,
      centerX - size.width / 2,
      headAnchorY - SPACING.headGap - size.height
    );
    nodes.push(card);

    const bottom = card.y + card.height;
    wires.push({
      id: `wire:${card.id}`,
      points: [
        [centerX, headAnchorY],
        [centerX, bottom],
      ],
    });

    if (index === 0) {
      nodes.push({
        kind: "caption",
        id: "caption:head",
        text: "Head",
        x: centerX,
        y: (headAnchorY + bottom) / 2,
      });
    }

    headAnchorY = card.y;
  });

  // Children: one row, top-aligned and centred under the class, all hanging
  // off a single bus line.
  const centerBottom = center.y + center.height;
  const busY = centerBottom + SPACING.childDrop;

  if (data.children.length > 0) {
    const sizes = data.children.map((child) => measureCard(child, mode));
    const rowWidth =
      sizes.reduce((total, size) => total + size.width, 0) +
      (sizes.length - 1) * SPACING.childGap;
    const childTop = busY + SPACING.busToChild;

    let x = centerX - rowWidth / 2;
    data.children.forEach((child, index) => {
      const card = cardOf(`child:${child.id}:${index}`, child, x, childTop);
      nodes.push(card);

      const childX = card.x + card.width / 2;
      wires.push({
        id: `wire:${card.id}`,
        points: [
          [centerX, centerBottom],
          [centerX, busY],
          [childX, busY],
          [childX, childTop],
        ],
      });

      x += card.width + SPACING.childGap;
    });

    nodes.push({
      kind: "caption",
      id: "caption:children",
      text: "Children",
      x: centerX,
      y: (centerBottom + busY) / 2,
    });
  }

  // The side stacks must stay clear of the children's bus line, or their
  // wires would cross it.
  const stackBottomLimit =
    data.children.length > 0 ? busY - SPACING.stackToBus : Infinity;

  const sideInput = {
    center,
    centerY,
    mode,
    branchReach,
    showLinkLabels,
    stackBottomLimit,
  };

  layoutSide("backward", data.backward, sideInput, nodes, wires);
  layoutSide("forward", data.forward, sideInput, nodes, wires);

  return { nodes, wires };
}

type SideInput = {
  center: ClassCardNode;
  centerY: number;
  mode: GraphMode;
  branchReach: number;
  /** Whether each link's own chip is drawn on its branch. */
  showLinkLabels: boolean;
  stackBottomLimit: number;
};

/**
 * One side's links: the linked classes stacked in a column, the create
 * affordance under them, all joined by a vertical trunk that leaves the centre
 * card at its middle.
 *
 * Laid out for the right side and mirrored for the left, so the two can never
 * drift apart.
 */
function layoutSide(
  side: LinkSide,
  links: ClassGraphLink[],
  {
    center,
    centerY,
    mode,
    branchReach,
    showLinkLabels,
    stackBottomLimit,
  }: SideInput,
  nodes: ClassGraphNode[],
  wires: Wire[]
) {
  const direction = side === "forward" ? 1 : -1;
  const edgeX = side === "forward" ? center.x + center.width : center.x;
  const trunkX = edgeX + direction * SPACING.sideReach;

  /** Left coordinate of a box whose near edge sits `distance` past the trunk. */
  const boxLeft = (distance: number, width: number) =>
    side === "forward" ? trunkX + distance : trunkX - distance - width;

  const placeholderLabel =
    side === "forward" ? "Add forward link" : "Add backward link";

  // Nothing to stack: the affordance hangs straight off the centre card, the
  // way the design shows an empty side.
  if (links.length === 0) {
    const placeholder = {
      kind: "placeholder" as const,
      id: `placeholder:${side}`,
      side,
      label: placeholderLabel,
      ...PLACEHOLDER_SIZE,
      x: boxLeft(SPACING.trunkToPlaceholder, PLACEHOLDER_SIZE.width),
      y: centerY - PLACEHOLDER_SIZE.height / 2,
    };
    nodes.push(placeholder);

    const nearX =
      side === "forward" ? placeholder.x : placeholder.x + placeholder.width;
    wires.push({
      id: `wire:${placeholder.id}`,
      dashed: true,
      points: [
        [edgeX, centerY],
        [nearX, centerY],
      ],
    });
    return;
  }

  const sizes = links.map(({ twinClass }) => measureCard(twinClass, mode));
  const stackHeight =
    sizes.reduce((total, size) => total + size.height, 0) +
    links.length * SPACING.stackGap +
    PLACEHOLDER_SIZE.height;

  // Centred on the class, then lifted if that would reach down to the
  // children's bus.
  const top = Math.min(
    centerY - stackHeight / 2,
    stackBottomLimit - stackHeight
  );

  let y = top;
  let lowestJoinY = centerY;

  links.forEach(({ link, twinClass }, index) => {
    const size = sizes[index]!;
    const card: ClassCardNode = {
      kind: "class",
      id: `${side}:${link.id ?? twinClass.id}:${index}`,
      twinClass,
      isCenter: false,
      x: boxLeft(branchReach, size.width),
      y,
      ...size,
    };
    nodes.push(card);

    const joinY = card.y + card.height / 2;
    const nearX = side === "forward" ? card.x : card.x + card.width;
    lowestJoinY = Math.max(lowestJoinY, joinY);

    wires.push({
      id: `wire:${card.id}`,
      points: [
        [edgeX, centerY],
        [trunkX, centerY],
        [trunkX, joinY],
        [nearX, joinY],
      ],
    });

    if (showLinkLabels) {
      nodes.push({
        kind: "linkPill",
        id: `pill:${card.id}`,
        link,
        x: (trunkX + nearX) / 2,
        y: joinY,
      });
    }

    y += size.height + SPACING.stackGap;
  });

  const placeholder = {
    kind: "placeholder" as const,
    id: `placeholder:${side}`,
    side,
    label: placeholderLabel,
    ...PLACEHOLDER_SIZE,
    x: boxLeft(SPACING.trunkToPlaceholder, PLACEHOLDER_SIZE.width),
    y,
  };
  nodes.push(placeholder);

  // Continues the trunk from wherever the solid part ends, so the dashes never
  // run underneath a solid line.
  const placeholderY = placeholder.y + placeholder.height / 2;
  const placeholderNearX =
    side === "forward" ? placeholder.x : placeholder.x + placeholder.width;
  wires.push({
    id: `wire:${placeholder.id}`,
    dashed: true,
    points: [
      [trunkX, lowestJoinY],
      [trunkX, placeholderY],
      [placeholderNearX, placeholderY],
    ],
  });

  nodes.push({
    kind: "caption",
    id: `caption:${side}`,
    text: side === "forward" ? "Forward" : "Backward",
    x: (edgeX + trunkX) / 2,
    y: centerY,
  });
}
