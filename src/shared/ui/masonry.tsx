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
  return <div className={cn(`columns-${colCount}`, className)}>{children}</div>;
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
  const classes = Array.isArray(className)
    ? className.join(" ")
    : (className ?? "");
  const isDebug = classes.includes("debug");

  return (
    <div className={cn("min-w-0 break-inside-avoid", classes)}>
      {isDebug && col != null && row != null && (
        <span className="absolute top-0 left-0 z-10 rounded-br bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
          col-{col}(row-{row})
        </span>
      )}
      {children}
    </div>
  );
}

export const Masonry = {
  Grid,
  Column,
  Item,
};
