import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Columns3, GripVertical } from "lucide-react";

import { CheckboxFormItem } from "@/components/form-fields";

import { Label } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface Column {
  id: string;
  name: string;
  visible: boolean;
}

interface Props {
  columns: Column[];
  sortKeys: string[];
  onVisibleChange: (columns: string[]) => void;
  onSortChange: (columns: string[]) => void;
  onReset?: () => void;
}

export function ColumnManagerPopover({
  columns,
  onVisibleChange,
  onSortChange,
  onReset,
}: Props) {
  function onColumnSwitch(columnKey: string) {
    const newColumns = columns.map((column) =>
      column.id === columnKey
        ? {
            ...column,
            visible: !column.visible,
          }
        : column
    );

    onVisibleChange(
      newColumns.filter((column) => column.visible).map((column) => column.id)
    );
  }

  function resetColumns() {
    onReset?.();
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === over?.id);

      const newColumns = [...columns];
      newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, columns[oldIndex]!);

      onSortChange(newColumns.map((column) => column.id));
    }
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconS6"
              aria-label="Configure columns"
              onClick={(event) => event.stopPropagation()}
            >
              <Columns3 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Configure columns</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        className="p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4 pb-0">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={columns}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column) => {
                return (
                  <DraggableCheckbox
                    key={column.id}
                    column={column}
                    onChange={() => onColumnSwitch(column.id)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>

        <PopoverFooter>
          <Button onClick={() => resetColumns()} type="reset" variant="outline">
            Reset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

function DraggableCheckbox({
  column,
  onChange,
}: {
  column: Column;
  onChange: () => any;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-row items-center justify-between"
    >
      <Label className="grow">{column.name}</Label>

      <CheckboxFormItem
        key={column.id}
        fieldValue={column.visible}
        onChange={onChange}
      />

      <div {...listeners} {...attributes}>
        <GripVertical />
      </div>
    </div>
  );
}
