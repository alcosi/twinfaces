import MDEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";
import { MouseEvent } from "react";

import { MarkdownIcon } from "@/shared/ui";

type MarkdownPreviewProps = {
  markdown: string;
};

export const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  const { resolvedTheme } = useTheme();

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest("a.anchor") || target.closest("div.copied")) {
      e.stopPropagation();
    }
  };

  return (
    <div
      data-color-mode={resolvedTheme}
      className="relative px-3.5 py-4"
      onClick={handleClick}
    >
      <MarkdownIcon className="absolute inset-y-1 -end-1 h-5 w-5" />

      <MDEditor.Markdown source={markdown} />
    </div>
  );
};
