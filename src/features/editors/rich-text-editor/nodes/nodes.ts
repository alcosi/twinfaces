import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical";

import { ImageNode } from "./image-node";
import { InlineImageNode } from "./inline-image-node";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    ListNode,
    ListItemNode,
    LinkNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    ImageNode,
    InlineImageNode,
  ];
