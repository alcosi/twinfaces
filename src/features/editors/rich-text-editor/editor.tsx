"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $createParagraphNode,
  $getRoot,
  $isElementNode,
  EditorState,
  SerializedEditorState,
} from "lexical";
import { useEffect, useRef } from "react";

import { TooltipProvider } from "@/shared/ui";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { editorTheme } from "./themes/editor-theme";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorState,
  editorSerializedState,
  onHtmlChange,
  onChange,
  onSerializedChange,
  initialHTML = "",
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onHtmlChange?: (html: string) => void;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  initialHTML?: string;
}) {
  return (
    <div className="bg-background border-border overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <HTMLContentPlugin html={initialHTML} />
          <HtmlExportPlugin onHtmlChange={onHtmlChange} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

function HTMLContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current || !html) return;
    didInit.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();

      const blockNodes = nodes.filter((node) => $isElementNode(node));

      if (blockNodes.length > 0) {
        blockNodes.forEach((n) => root.append(n));
      } else {
        const paragraph = $createParagraphNode();
        nodes.forEach((node) => paragraph.append(node));
        root.append(paragraph);
      }
    });
  }, [editor, html]);

  return null;
}

function HtmlExportPlugin({
  onHtmlChange,
}: {
  onHtmlChange?: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      ignoreSelectionChange={true}
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onHtmlChange?.(html);
        });
      }}
    />
  );
}
