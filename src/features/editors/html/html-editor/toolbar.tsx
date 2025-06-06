import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  INSERT_TABLE_COMMAND,
} from "@lexical/table";
import {
  $getRoot,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from "lexical";
import { ChangeEvent, useRef } from "react";

import {
  AttachmentIcon,
  Button,
  ListOLIcon,
  ListULIcon,
  Separator,
  TableAddColumnIcon,
  TableAddRowIcon,
  TableIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import { $createImageNode } from "./image-node";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertRow = (insertAfter: boolean) => {
    editor.update(() => {
      $insertTableRowAtSelection(insertAfter);
    });
  };

  const insertColumn = (insertAfter: boolean) => {
    editor.update(() => {
      $insertTableColumnAtSelection(insertAfter);
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const src = URL.createObjectURL(file);
    editor.update(() => {
      const imageNode = $createImageNode(src, file.name);
      const selection = $getSelection();
      if (selection?.insertNodes) {
        selection.insertNodes([imageNode]);
      } else {
        $getRoot().append(imageNode);
      }
    });

    e.target.value = "";
  };

  function $generateHtmlFromNodes(editor: LexicalEditor, arg1: null) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="border-primary-foreground bg-primary-foreground dark:bg-primary-foreground mt-2 flex items-center gap-1 rounded-t-md border-b p-1">
      <Tooltip>
        <TooltipTrigger>
          <Button
            className="h-8 w-8"
            variant="ghost"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          >
            <strong>B</strong>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            className="h-8 w-8"
            variant="ghost"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          >
            <em>I</em>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            className="h-8 w-8"
            variant="ghost"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          >
            <u>U</u>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Underline</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-4" />

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                columns: "2",
                rows: "1",
              })
            }
            IconComponent={TableIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Table</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8 rotate-180"
            variant="ghost"
            onClick={() => insertRow(true)}
            IconComponent={TableAddRowIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Row below</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() => insertRow(false)}
            IconComponent={TableAddRowIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Row above</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8 rotate-180"
            variant="ghost"
            onClick={() => insertColumn(true)}
            IconComponent={TableAddColumnIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Column right</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() => insertColumn(false)}
            IconComponent={TableAddColumnIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Column left</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-4" />

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() =>
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            }
            IconComponent={ListULIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Unordered list</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() =>
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
            IconComponent={ListOLIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Ordered list</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-4" />

      {
        //TODO the need for this functionality is questionable
      }
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            className="h-8 w-8"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            IconComponent={AttachmentIcon}
          />
        </TooltipTrigger>
        <TooltipContent>Add attachment</TooltipContent>
      </Tooltip>

      {
        //TODO remove this button, needed only for development
      }
      <Button
        className="h-8 w-8"
        variant="ghost"
        onClick={() => {
          editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            console.log("Data to server:", htmlString);
          });
        }}
      >
        Log
      </Button>
    </div>
  );
}
