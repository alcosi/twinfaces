"use client";

import { XCircle } from "lucide-react";

import { SelectAdapter, isPopulatedArray } from "@/shared/libs";
import { Badge } from "@/shared/ui/badge";

import { ComboboxProps } from "./types";

const MAX_COUNT = 3;

type Props<T> = Pick<SelectAdapter<T>, "renderItem"> &
  Pick<ComboboxProps<T>, "selectPlaceholder" | "multi"> & {
    selected: T[];
    getItemKey: (item: T) => string;
    onChange: (value: T[]) => void;
  };

export const SelectedOptions = <T,>({
  selected,
  getItemKey,
  renderItem,
  onChange,
  selectPlaceholder,
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
    return <span className="opacity-50">{selectPlaceholder}</span>;
  }

  return multi ? (
    <div className="flex w-full flex-wrap items-center">
      {selected.slice(0, MAX_COUNT).map((item, index) => (
        <Badge
          key={getItemKey(item)}
          className="text-foreground border-foreground/10 hover:bg-card m-1 bg-transparent transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          <span className="mr-2 max-w-[130px] truncate">
            {renderItem(item)}
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
        <Badge className="text-foreground border-foreground/10 hover:bg-card m-1 mr-2 flex max-w-80 items-center truncate bg-transparent transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
          <span className="mr-2 max-w-[100px] truncate">{`+ ${selected.length - MAX_COUNT} more`}</span>
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
    <>
      {isPopulatedArray<T>(selected) ? (
        <span className="max-w-70 truncate">{renderItem(selected[0]!)}</span>
      ) : (
        <span className="opacity-50">{selectPlaceholder}</span>
      )}
    </>
  );
};
