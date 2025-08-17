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
    <div className={cn(`group columns-${colCount}`, className)}>{children}</div>
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

function Item(
  props: PropsWithChildren<{
    testId?: string;
    className?: string | string[];
  }>
) {
  const { testId, className, children } = props;

  return (
    <div
      className={cn(
        "relative min-w-0 break-inside-avoid",
        "group-[.debug]:border-error group-[.debug]:border-2 group-[.debug]:border-dashed",
        className
      )}
    >
      <span className="bg-error text-secondary pointer-events-none absolute top-0 left-0 z-10 hidden rounded-br px-2 py-0.5 text-xs font-bold group-[.debug]:inline">
        {testId ?? "N/A"}
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
