import MDEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";

import { HTMLIcon } from "@/shared/ui";

type HTMLPreviewProps = {
  source?: string;
};

export const HTMLPreview = ({ source }: HTMLPreviewProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <div data-color-mode={resolvedTheme} className="relative w-full">
      <HTMLIcon className="absolute inset-y-1.5 end-2 h-5 w-5" />

      <MDEditor.Markdown
        className="html-preview"
        source={source}
        style={{
          padding: "1rem 1.5rem",
          background: "var(--background)",
        }}
      />
    </div>
  );
};
