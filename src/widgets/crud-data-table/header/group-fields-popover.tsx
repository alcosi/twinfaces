import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Layers } from "lucide-react";

import { CheckboxFormItem } from "@/components/form-fields";

import { isPopulatedArray } from "@/shared/libs";
import { Label } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from "@/shared/ui/popover";

import { TableGroupField } from "../grouped-table";

type Props = {
  fields: TableGroupField[];
  /** Selected field keys, outermost group level first. */
  value: string[];
  onChange: (value: string[]) => void;
};

/**
 * Picks the fields the table view is grouped by. Checked fields are the group
 * levels, top to bottom in the order they are listed, and dragging a field
 * moves its level. Unchecked fields wait below the checked ones.
 */
export function GroupFieldsPopover({ fields, value, onChange }: Props) {
  const selected = value.filter((key) =>
    fields.some((field) => field.key === key)
  );
  const ordered = [
    ...selected.map((key) => fields.find((field) => field.key === key)!),
    ...fields.filter((field) => !selected.includes(field.key)),
  ];

  function selectedKeysIn(list: TableGroupField[], keys: string[]) {
    return list.filter((field) => keys.includes(field.key)).map((f) => f.key);
  }

  function handleToggle(key: string) {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : selectedKeysIn(ordered, [...selected, key])
    );
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const from = ordered.findIndex((field) => field.key === active.id);
    const to = ordered.findIndex((field) => field.key === over.id);
    const next = [...ordered];
    next.splice(to, 0, ...next.splice(from, 1));

    onChange(selectedKeysIn(next, selected));
  }

  const triggerLabel = isPopulatedArray(selected)
    ? selected
        .map((key) => fields.find((field) => field.key === key)?.label)
        .join(", ")
    : "None";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="max-w-72 gap-[5px]"
          title="Group rows by fields"
        >
          <span className="truncate">Group: {triggerLabel}</span>
          <Layers />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        <div className="max-h-[60vh] overflow-y-auto px-2 pt-2 pb-2">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={ordered.map((field) => field.key)}
              strategy={verticalListSortingStrategy}
            >
              {ordered.map((field) => (
                <DraggableField
                  key={field.key}
                  field={field}
                  checked={selected.includes(field.key)}
                  onToggle={() => handleToggle(field.key)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <PopoverFooter className="p-2">
          <Button
            type="button"
            variant="outline"
            disabled={!isPopulatedArray(selected)}
            onClick={() => onChange([])}
          >
            Remove grouping
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

function DraggableField({
  field,
  checked,
  onToggle,
}: {
  field: TableGroupField;
  checked: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.key });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className="hover:bg-muted flex flex-row items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
    >
      <div
        {...listeners}
        {...attributes}
        className="text-muted-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <CheckboxFormItem fieldValue={checked} onChange={onToggle} />

      <Label
        className="grow cursor-pointer text-sm"
        onClick={onToggle}
        data-checked={checked}
      >
        {field.label}
      </Label>
    </div>
  );
}
