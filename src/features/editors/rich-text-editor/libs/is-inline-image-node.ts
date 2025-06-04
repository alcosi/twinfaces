import { LexicalNode } from "lexical";

import { InlineImageNode } from "../nodes/inline-image-node";

export function $isInlineImageNode(
  node: LexicalNode | null | undefined
): node is InlineImageNode {
  return node instanceof InlineImageNode;
}
