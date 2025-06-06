import { $generateNodesFromDOM } from "@lexical/html";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ParagraphNode, TextNode } from "lexical";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  EditorState,
} from "lexical";
import { useEffect } from "react";

import { ImageNode } from "./image-node";
import { ToolbarPlugin } from "./toolbar";

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  tableCell: "bg-background border border-border p-2",
  table: "mt-4 w-full border-collapse text-sm leading-5",
};

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
    console.log("Editor content:", root, "Selection:", selection);
  });
}

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

function HTMLContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      if (nodes.length > 0) {
        nodes.forEach((n) => root.append(n));
      } else {
        root.append($createParagraphNode());
      }
    });
  }, [editor, html]);

  return null;
}

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export function HTMLEditor({ initialHTML = "" }: { initialHTML?: string }) {
  const initialConfig: InitialConfigType = {
    namespace: "HTMLEditor",
    theme,
    onError,
    editable: true,
    nodes: [
      TableNode,
      TableRowNode,
      TableCellNode,
      ListNode,
      ListItemNode,
      TextNode,
      ParagraphNode,
      //TODO Experimental node (custom ImageNode)
      ImageNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <div className="sticky top-0 z-10">
          <ToolbarPlugin />
        </div>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="html-preview dark:bg-background border-muted mb-2 max-h-[600px] min-h-[200px] overflow-auto rounded-b-md border p-4 font-sans focus:outline-none" />
          }
          placeholder={<div>Enter text…</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HTMLContentPlugin html={initialHTML} />
        <OnChangePlugin onChange={onChange} />
        <TablePlugin />
        <ListPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}
