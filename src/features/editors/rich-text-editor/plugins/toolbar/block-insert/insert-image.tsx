"use client";

import { ImageIcon } from "lucide-react";

import { SelectItem } from "@/shared/ui";

import { useToolbarContext } from "../../../context/toolbar-context";
import { InsertImageDialog } from "../../../plugins/images-plugin";

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="image"
      onPointerUp={(e) => {
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </SelectItem>
  );
}
