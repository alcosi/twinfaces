"use client";

import { EditorView } from "@codemirror/view";
import MDEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type MarkdownEditorProps = {
  markdown: string;
  onChange?: (event: { target: { markdown: string } }) => void;
};

export const MarkdownEditor = ({ markdown, onChange }: MarkdownEditorProps) => {
  const [editorValue, setEditorValue] = useState(markdown);
  const { resolvedTheme } = useTheme();

  const handleChange = (value?: string) => {
    const newValue = value ?? "";
    setEditorValue(newValue);
    if (onChange) {
      onChange({ target: { markdown: newValue } });
    }
  };
  useEffect(() => {
    setEditorValue(markdown);
  }, [markdown]);

  return (
    <div className="space-y-5">
      <div data-color-mode={resolvedTheme}>
        <MDEditor
          value={editorValue}
          onChange={handleChange}
          reExtensions={[EditorView.lineWrapping]}
          enablePreview={false}
        />
      </div>
    </div>
  );
};
