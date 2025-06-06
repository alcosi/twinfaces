"use client";

import { FileImageIcon } from "lucide-react";

import { SelectItem } from "@/shared/ui";

import { useToolbarContext } from "../../../context/toolbar-context";
import { InsertInlineImageDialog } from "../../inline-image-plugin";

export function InsertInlineImage() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="inline-image"
      onPointerUp={() =>
        showModal("Insert Inline Image", (onClose) => (
          <InsertInlineImageDialog
            activeEditor={activeEditor}
            onClose={onClose}
          />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <FileImageIcon className="size-4" />
        <span>Inline Image</span>
      </div>
    </SelectItem>
  );
}
