import { Link_MANAGED } from "@/entities/link";
import { TwinClass_DETAILED } from "@/entities/twin-class";

/**
 * How much of each class the canvas draws.
 *
 * `simple` is one compact card per class — its name and a line of context.
 * `advanced` keeps the same skeleton and unfolds every card into the fields and
 * statuses the class carries.
 */
export type GraphMode = "simple" | "advanced";

/** The two sides a link can hang off the class from. */
export type LinkSide = "forward" | "backward";

/** One link of the class, paired with the class at its other end. */
export type ClassGraphLink = {
  link: Link_MANAGED;
  twinClass: TwinClass_DETAILED;
};

/** Everything the Graph tab draws around one class. */
export type ClassGraphData = {
  center: TwinClass_DETAILED;
  /** The class's head, then the head's head, and so on upwards. */
  heads: TwinClass_DETAILED[];
  children: TwinClass_DETAILED[];
  /**
   * Every link occurrence, not every unique class: two links to the same class
   * are two lines on the canvas, just as they are two rows on the Relations tab.
   */
  forward: ClassGraphLink[];
  backward: ClassGraphLink[];
};

type Box = { x: number; y: number; width: number; height: number };

/** An advanced card's block that can list more than `CARD.chipLimit` chips. */
export type CardSection = "fields" | "statuses";

/** Which of a card's blocks are unfolded to list every chip. */
export type CardExpansion = Partial<Record<CardSection, boolean>>;

export type ClassCardNode = Box & {
  kind: "class";
  id: string;
  twinClass: TwinClass_DETAILED;
  /** The class the tab belongs to. Drawn without a link to itself. */
  isCenter: boolean;
  expansion: CardExpansion;
};

export type PlaceholderNode = Box & {
  kind: "placeholder";
  id: string;
  side: LinkSide;
  label: string;
};

/**
 * A caption sitting on a line — "Head", "Children", "forward", "backward".
 * Positioned by its centre, since its width is the text's own.
 */
export type CaptionNode = {
  kind: "caption";
  id: string;
  text: string;
  x: number;
  y: number;
};

/** The link's own chip, sitting on the line it draws. Centre-positioned. */
export type LinkPillNode = {
  kind: "linkPill";
  id: string;
  link: Link_MANAGED;
  x: number;
  y: number;
};

export type ClassGraphNode =
  | ClassCardNode
  | PlaceholderNode
  | CaptionNode
  | LinkPillNode;

/** One orthogonal connector, as the points it bends at. */
export type Wire = {
  id: string;
  points: [number, number][];
  /** Dashed wires lead to create affordances. */
  dashed?: boolean;
  /**
   * Indices of the points whose corner is drawn rounded. Only the corners at
   * the far ends of a trunk: at a junction another wire carries straight on,
   * and a rounded corner there would leave a fillet hanging off the line.
   */
  rounded?: number[];
};

export type ClassGraphLayout = {
  nodes: ClassGraphNode[];
  wires: Wire[];
};
