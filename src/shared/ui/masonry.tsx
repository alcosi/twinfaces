import { PropsWithChildren } from "react";

import { cn } from "../libs";

export function Grid({
  colCount,
  className,
  children,
}: PropsWithChildren<{
  colCount: number;
  className?: string | string[];
}>) {
  return (
    <div className={cn(`group columns-${colCount}`, className)}>{children}</div> //NOTE use `debug` class to enable debug mode
  );
}

function Column({
  className,
  children,
}: PropsWithChildren<{ className?: string | string[] }>) {
  return (
    <div className={cn("grid auto-rows-min grid-cols-1", className)}>
      {children}
    </div>
  );
}

function Item({
  className,
  children,
  col,
  row,
}: PropsWithChildren<{
  className?: string | string[];
  col?: number;
  row?: number;
}>) {
  return (
    <div className={cn("min-w-0 break-inside-avoid", className)}>
      <span className="pointer-events-none absolute top-0 left-0 z-10 hidden rounded-br bg-red-600 px-2 py-0.5 text-xs font-bold text-white group-[.debug]:inline-flex">
        {col != null && row != null ? `col-${col}(row-${row})` : ""}
      </span>
      {children}
    </div>
  );
}

export const Masonry = {
  Grid,
  Column,
  Item,
};
