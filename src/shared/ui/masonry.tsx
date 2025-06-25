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
  return <div className={cn("grid grid-cols-1", className)}>{children}</div>;
}

function Item({
  className,
  children,
}: PropsWithChildren<{ className?: string | string[] }>) {
  return (
    <div className={cn("min-w-0 break-inside-avoid", className)}>
      {children}
    </div>
  );
}

export const Masonry = {
  Grid,
  Column,
  Item,
};
