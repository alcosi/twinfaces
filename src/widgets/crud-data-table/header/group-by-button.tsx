import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ColumnDef } from "@tanstack/react-table";
import { AlignJustify } from "lucide-react";
import { getColumnKey } from "../helpers";

interface GroupByButtonProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  onGroupByChange: (groupBy?: string) => void;
}

export function GroupByButton<TData, TValue>({
  columns,
  onGroupByChange,
}: GroupByButtonProps<TData, TValue>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="default">
          <AlignJustify />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        <RadioGroup className="space-y-4" onValueChange={onGroupByChange}>
          {columns.map((column) => {
            const key = getColumnKey(column);
            return (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} />
                <Label htmlFor={key}>
                  <>{column.header}</>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
