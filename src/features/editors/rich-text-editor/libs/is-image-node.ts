import { LexicalNode } from "lexical";

import { ImageNode } from "../nodes/image-node";

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
