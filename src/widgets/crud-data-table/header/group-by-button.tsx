import { Button } from "@/components/base/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { CheckboxFormItem } from "@/components/form-fields/checkbox-form-field";
import { ColumnDef } from "@tanstack/react-table";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { getColumnKey } from "../helpers";

interface GroupByButtonProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  onGroupByChange: (groupBy?: string) => void;
}

function resetCheckboxes<TData, TValue>(
  columns: ColumnDef<TData, TValue>[]
): Record<string, boolean> {
  return Object.fromEntries(columns.map((col) => [getColumnKey(col), false]));
}

export function GroupByButton<TData, TValue>({
  columns,
  onGroupByChange,
}: GroupByButtonProps<TData, TValue>) {
  const [checkedValues, setCheckedValues] = useState<Record<string, boolean>>(
    resetCheckboxes(columns)
  );

  const handleCheckboxChange = (key: string) => {
    setCheckedValues(() => {
      const updatedValues = resetCheckboxes(columns);
      updatedValues[key] = !checkedValues[key];
      onGroupByChange(updatedValues[key] ? key : undefined);
      return updatedValues;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="default">
          <AlignJustify />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        {/* <header className="text-wrap w-full">
          {Object.entries(checkedValues).map((e) => (
            <p>{JSON.stringify(e)}</p>
          ))}
        </header> */}
        <div className="space-y-4">
          {columns.map((column) => {
            const key = getColumnKey(column);
            return (
              key && (
                <CheckboxFormItem
                  key={key}
                  fieldValue={checkedValues[key]}
                  onChange={() => handleCheckboxChange(key)}
                  label={<>{column.header}</>}
                />
              )
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
