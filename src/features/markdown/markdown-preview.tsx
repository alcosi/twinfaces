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
      className="flex w-full flex-row flex-nowrap justify-between gap-1"
      onClick={handleClick}
    >
      <MDEditor.Markdown
        source={source}
        style={{
          background: "var(--background)",
        }}
      />

      <MarkdownIcon className="my-0.75 min-h-5 min-w-5 flex-shrink" />
    </div>
  );
};
