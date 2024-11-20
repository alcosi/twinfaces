"use client";

import { Badge } from "@/components/base/badge";
import { XCircle } from "lucide-react";

const MAX_COUNT = 3;

type Props<T> = {
  selected: T[];
  getItemKey: (item: T) => string;
  getItemLabel: (item: T) => string;
  onChange: (value: T[]) => void;
  placeholder?: string;
  multi?: boolean;
};

export const SelectedOptions = <T,>({
  selected,
  getItemKey,
  getItemLabel,
  onChange,
  placeholder,
  multi,
}: Props<T>) => {
  const removeOption = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onChange(newSelected);
  };

  const clearExtraOptions = () => {
    const trimmedSelection = selected.slice(0, MAX_COUNT);
    onChange(trimmedSelection);
  };

  if (selected.length === 0) {
    return <span className="opacity-50">{placeholder}</span>;
  }

  return multi ? (
    <div className="flex flex-wrap items-center w-full">
      {selected.slice(0, MAX_COUNT).map((item, index) => (
        <Badge
          key={getItemKey(item)}
          className="bg-transparent text-foreground border-foreground/10 hover:bg-card m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        >
          <span className="truncate max-w-[130px] mr-2">
            {getItemLabel(item)}
          </span>
          <XCircle
            className="h-4 w-4 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              removeOption(index);
            }}
          />
        </Badge>
      ))}

      {selected.length > MAX_COUNT && (
        <Badge className="truncate max-w-80 mr-2 bg-transparent text-foreground border-foreground/10 hover:bg-card m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 flex items-center">
          <span className="truncate max-w-[100px] mr-2">{`+ ${selected.length - MAX_COUNT} more`}</span>
          <XCircle
            className="h-4 w-4 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              clearExtraOptions();
            }}
          />
        </Badge>
      )}
    </div>
  ) : (
    getItemLabel(selected[0] as T)
  );
};
