import MDEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";
import { MouseEvent } from "react";

import { MarkdownIcon } from "@/shared/ui";

type MarkdownPreviewProps = {
  source?: string;
};

export const MarkdownPreview = ({ source }: MarkdownPreviewProps) => {
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
      className="relative w-full"
      onClick={handleClick}
    >
      <MarkdownIcon className="absolute -end-3 -top-6 h-5 w-5" />

      <MDEditor.Markdown
        source={source}
        style={{
          background: "var(--background)",
        }}
      />
    </div>
  );
};
