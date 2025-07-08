// import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useState } from "react";

import { cn } from "@/shared/libs";
import { Separator } from "@/shared/ui";

import { ContentEditable } from "../ui";
import { ImagesPlugin } from "./images-plugin";
import { InlineImagePlugin } from "./inline-image-plugin";
import { LinkPlugin } from "./link-plugin";
import { TableActionMenuPlugin } from "./table-action-menu-plugin";
import { TableCellResizerPlugin } from "./table-cell-resizer-plugin";
import { BlockFormatDropDown } from "./toolbar/block-format-toolbar-plugin";
import { FormatBulletedList } from "./toolbar/block-format/format-bulleted-list";
import { FormatHeading } from "./toolbar/block-format/format-heading";
import { FormatNumberedList } from "./toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "./toolbar/block-format/format-paragraph";
import { BlockInsertPlugin } from "./toolbar/block-insert-plugin";
import { InsertImage } from "./toolbar/block-insert/insert-image";
import { InsertInlineImage } from "./toolbar/block-insert/insert-inline-image";
import { InsertTable } from "./toolbar/block-insert/insert-table";
import { FontFormatToolbarPlugin } from "./toolbar/font-format-toolbar-plugin";
import { ToolbarPlugin } from "./toolbar/toolbar-plugin";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div
            className={cn(
              "flex gap-2 overflow-auto p-1",
              "border-border border-b",
              "align-middle"
            )}
          >
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              {/* <FormatCheckList /> */}
              {/* <FormatCodeBlock /> */}
              {/* <FormatQuote /> */}
            </BlockFormatDropDown>

            <Separator orientation="vertical" className="h-8" />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />

            <Separator orientation="vertical" className="h-8" />
            <BlockInsertPlugin>
              <InsertTable />
              <InsertImage />
              <InsertInlineImage />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div ref={onRef} className="max-h-96 overflow-auto">
              <ContentEditable placeholder="Start typing ..." />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* editor plugins */}
        <ListPlugin />
        {/* <CheckListPlugin /> */}
        <TablePlugin />
        <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
        <TableCellResizerPlugin />
        {/* <TableHoverActionsPlugin anchorElem={floatingAnchorElem} /> */}
        <ImagesPlugin />
        <InlineImagePlugin />
        <LinkPlugin />
      </div>

      {/* actions plugins */}
    </div>
  );
}
