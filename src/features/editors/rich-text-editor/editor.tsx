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
  EditorState,
  SerializedEditorState,
} from "lexical";
import { useEffect } from "react";

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

type EditorStateProps = {
  mode: "state";
  editorState?: EditorState;
  onChange?: (s: EditorState) => void;
};

type EditorHtmlProps = {
  mode: "html";
  initialHTML?: string;
  onHtmlChange?: (html: string) => void;
};

type EditorSerializedProps = {
  mode: "serialized";
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (state: SerializedEditorState) => void;
};

export type EditorProps =
  | EditorStateProps
  | EditorHtmlProps
  | EditorSerializedProps;

export function Editor(props: EditorProps) {
  const initialConfig: InitialConfigType = {
    ...editorConfig,
    // ...(props.editorState ? { editorState: props.editorState } : {}),
    // ...(props.editorSerializedState
    //   ? { editorState: JSON.stringify(props.editorSerializedState) }
    //   : {}),
  };

  return (
    <div className="bg-background border-border overflow-hidden rounded-lg border shadow">
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          <Plugins />

          {/* === Custom plugins === */}
          {props.mode === "html" && (
            <HTMLContentPlugin defaultHtml={props.initialHTML ?? ""} />
          )}

          <ChangeHandlerPlugin {...props} />
          {/* === Custom plugins === */}
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

function HTMLContentPlugin({ defaultHtml }: { defaultHtml: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const parser = new DOMParser();

    editor.update(() => {
      const dom = parser.parseFromString(defaultHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();

      if (nodes.length > 0) {
        nodes.forEach((n) => root.append(n));
      } else {
        root.append($createParagraphNode());
      }
    });
  }, [editor]);

  return null;
}

/**
 * ChangeHandlerPlugin
 *
 * On *any* editor change:
 * 1) calls `onChange(editorState)` if provided
 * 2) calls `onSerializedChange(editorState.toJSON())` if provided
 * 3) reads nodes → calls `onHtmlChange(html)` if provided
 */
function ChangeHandlerPlugin({
  onChange,
  onHtmlChange,
  onSerializedChange,
}: {
  onChange?: (editorState: EditorState) => void;
  onHtmlChange?: (html: string) => void;
  onSerializedChange?: (state: SerializedEditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      ignoreSelectionChange={true}
      onChange={(editorState) => {
        onChange?.(editorState);
        onSerializedChange?.(editorState.toJSON());
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onHtmlChange?.(html);
        });
      }}
    />
  );
}
