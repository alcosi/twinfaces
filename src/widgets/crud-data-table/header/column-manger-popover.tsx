import { CheckboxFormItem } from "@/components/form-fields";
import { cn } from "@/shared/libs";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EyeIcon, GripVertical } from "lucide-react";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className={cn("block")}
          onClick={() => {
            setOpen(true);
          }}
          variant="default"
        >
          <EyeIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        <DndContext onDragEnd={handleDragEnd}>
          {/*<form className="space-y-8">*/}
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

          {/*<div className={"flex flex-row justify-end gap-2"}>*/}
          <Button onClick={() => resetColumns()} type="reset" variant="outline">
            Reset
          </Button>
        </DndContext>
        {/*</form>*/}
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
      className={"flex flex-row items-center justify-between"}
    >
      <CheckboxFormItem
        key={column.id}
        fieldValue={column.visible}
        onChange={onChange}
        label={column.name}
      />
      <div {...listeners} {...attributes}>
        <GripVertical />
      </div>
    </div>
  );
}
